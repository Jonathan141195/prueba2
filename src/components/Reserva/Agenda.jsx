import { useState, useEffect ,useContext} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Typography, Grid, Paper, Modal, Button, Avatar,
  IconButton, Fab, Box, TextField, MenuItem
} from '@mui/material';
import ReservaService from '../../services/ReservaService';
import UsuarioService from '../../services/UsuarioService';
import { teal, pink, grey, orange, red, purple } from '@mui/material/colors';
import { Info, Edit, Add, Cancel, CheckCircle} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../context/UserContext'; // Importa el contexto
const localizer = momentLocalizer(moment);

const stateColors = {
  Pendiente: grey[300],
  Confirmada: teal[300],
  Reprogramada: orange[300],
  Completada: pink[300],
  Cancelada: red[300],
  "No asistió": purple[300],
};

const EventDetails = ({ selectedEvent, handleClose }) => {
  const navigate = useNavigate();

  if (!selectedEvent) return null;

  const { id, estado_Reserva, usuario, servicio, horario } = selectedEvent;
  const userName = usuario?.nombre || 'Usuario Desconocido';
  const serviceName = servicio?.nombre || 'Servicio Desconocido';
  const branchName = horario[0]?.nombre || 'Sucursal Desconocida';
  const eventDate = horario[0]?.dia_semana ? moment(horario[0].dia_semana).format('LL') : 'Fecha Desconocida';

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: '#ffffff',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        color: 'black',
      }}
    >
      <Avatar sx={{ width: 56, height: 56, mb: 2, bgcolor: stateColors[estado_Reserva], color: '#000' }}>
        {userName[0]}
      </Avatar>
      <Typography variant="h6" component="h3" sx={{ color: 'black' }}>
        {serviceName}
      </Typography>
      <Typography variant="body1" sx={{ color: 'black' }}>
        <strong>Estado:</strong> {estado_Reserva || 'Estado Desconocido'}
      </Typography>
      <Typography variant="body1" sx={{ color: 'black' }}>
        <strong>Sucursal:</strong> {branchName}
      </Typography>
      <Typography variant="body1" sx={{ color: 'black' }}>
        <strong>Usuario:</strong> {userName}
      </Typography>
      <Typography variant="body1" sx={{ color: 'black' }}>
        <strong>Fecha:</strong> {eventDate}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
    {estado_Reserva !== 'Cancelada' && estado_Reserva !== 'Confirmada' && (
      <>
        <IconButton aria-label="Detalle" onClick={() => navigate(`/Reserva/Detalle/${id}`)} sx={{ color: 'black' }}>
          <Info />
        </IconButton>
        <IconButton aria-label="Editar" onClick={() => navigate(`/Reserva/editar/${id}`)} sx={{ color: 'black' }}>
          <Edit />
        </IconButton>
        <IconButton aria-label="Cancelar" onClick={() => navigate(`/reserva/cancel/${id}`)} sx={{ color: 'black' }}>
          <Cancel />
        </IconButton>
        <IconButton aria-label="Confirmar" onClick={() => navigate(`/reserva/confirmar/${id}`)} sx={{ color: 'black' }}>
          <CheckCircle />
        </IconButton>
      </>
    )}
    {estado_Reserva === 'Cancelada' && (
      <>
        <IconButton aria-label="Detalle" onClick={() => navigate(`/Reserva/Detalle/${id}`)} sx={{ color: 'black' }}>
          <Info />
        </IconButton>
      </>
    )}
    {estado_Reserva === 'Confirmada' && (
      <>
        <IconButton aria-label="Detalle" onClick={() => navigate(`/Reserva/Detalle/${id}`)} sx={{ color: 'black' }}>
          <Info />
        </IconButton>
        <IconButton aria-label="Cancelar" onClick={() => navigate(`/reserva/cancel/${id}`)} sx={{ color: 'black' }}>
          <Cancel />
        </IconButton>
      </>
    )}
  </Box>
  <Button variant="contained" color="primary" onClick={handleClose} sx={{ mt: 2 }}>
    Cerrar
  </Button>
</Box>
  );
};

EventDetails.propTypes = {
  selectedEvent: PropTypes.shape({
    id: PropTypes.string.isRequired,
    usuario: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
    }).isRequired,
    servicio: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
    }).isRequired,
    estado_Reserva: PropTypes.string.isRequired,
    horario: PropTypes.arrayOf(
      PropTypes.shape({
        dia_semana: PropTypes.string,
        hora_inicio: PropTypes.string,
        hora_fin: PropTypes.string,
        nombre: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
};

const CustomEvent = ({ event, title }) => {
  return (
    <div style={{ position: 'relative' }}>
      <div>{title}</div>
      <div style={{ position: 'absolute', top: '0', right: '0' }}>
        <IconButton>
          <Info />
        </IconButton>
        <IconButton>
          <Edit />
        </IconButton>
      </div>
    </div>
  );
};

CustomEvent.propTypes = {
  event: PropTypes.shape({
    resource: PropTypes.shape({
      id: PropTypes.string.isRequired,
      estado: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
};

const Agenda = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [loadedUsuario, setLoadedUsuario] = useState(false);
  const [encargado, setEncargado] = useState(0); // Valor por defecto para "todos los usuarios"
  const [fechaFiltro, setFechaFiltro] = useState(null);
  const navigate = useNavigate();
// Información del usuario
const { user, decodeToken, autorize } = useContext(UserContext);
const [userData, setUserData] = useState(decodeToken());
useEffect(() => {
  setUserData(decodeToken());
}, [user]);

  const fetchReservations = async () => {
    try {
      let data;
      if (fechaFiltro && encargado) {
        const response = await ReservaService.getReservaByUsuarioFecha(fechaFiltro,encargado, );
        data = response.data.results;
      } else if (fechaFiltro) {
        const response = await ReservaService.getFacturabydate(fechaFiltro);
        data = response.data.results;
      } else if (encargado) {
        const response = await ReservaService.getReservaByUsuario(encargado);
        data = response.data.results;
      } else {
        const response = await ReservaService.getReservaByUsuario_login(userData.id) ;
        data = response.data.results;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        toast.info('No existen citas agendadas para los filtros seleccionados.');
        
        return;
      }

      const userEvents = data
        .filter(reserva => reserva.horario !== null)
        .flatMap(reserva =>
          reserva.horario.map(horario => ({
            title: `${reserva.servicio.nombre} - ${reserva.estado_Reserva}`,
            start: new Date(`${horario.dia_semana}T${horario.hora_inicio}`),
            end: new Date(`${horario.dia_semana}T${horario.hora_fin}`),
            allDay: false,
            resource: reserva,
          }))
        );

      setEvents(userEvents);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Error al obtener las reservas. Inténtelo de nuevo más tarde.');
    }
  };

 

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await UsuarioService.getUsers();
        if (Array.isArray(response.data.results)) {
          setDataUsuario(response.data.results);
          setLoadedUsuario(true);
        } else {
          console.error('Unexpected response structure:', response);
          setLoadedUsuario(false);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoadedUsuario(false);
      }
    };
    fetchUsuarios();
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [encargado, fechaFiltro]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleCreate = () => {
    navigate('/Reserva/crear');
  };

  const handleFilter = () => {
    fetchReservations();
  };

  const handleClearFilters = () => {
    setEncargado(0);
    setFechaFiltro(null);
  };
  const eventPropGetter = (event) => {
    const backgroundColor = stateColors[event.resource.estado_Reserva] || grey[200];
    return { style: { backgroundColor } };
  };

  return (
    <div>
      <ToastContainer />
      <Typography variant="h3" gutterBottom sx={{ mt: 6 }}>
        Agenda de Reservas
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Filtrar por usuario"
              value={encargado}
              onChange={(e) => setEncargado(e.target.value)}
              fullWidth
            >
              <MenuItem value={0}>Todos los usuarios</MenuItem>
              {loadedUsuario && dataUsuario.map((usuario) => (
                <MenuItem key={usuario.id} value={usuario.id}>
                  {usuario.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Filtrar por fecha"
              value={fechaFiltro || ''}
              onChange={(e) => setFechaFiltro(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" onClick={handleFilter}>
              Filtrar
            </Button>
            <Button onClick={handleClearFilters}>
              Limpiar filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        components={{
          event: CustomEvent,
        }}
        messages={{
          next: "Sig",
          previous: "Ant",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          noEventsInRange: "No hay eventos en este rango.",
        }}
      />
      <Modal open={open} onClose={handleClose}>
        <EventDetails selectedEvent={selectedEvent} handleClose={handleClose} />
      </Modal>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleCreate}
        style={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Add />
      </Fab>
    </div>
  );
};

export default Agenda;









