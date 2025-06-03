import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  FormHelperText,
  MenuItem,
  Container,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import  { useCallback } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import FacturaService from '../../services/FacturaService';
import UsuarioService from '../../services/UsuarioService';
import SucursalService from '../../services/SucursalService';
import toast from 'react-hot-toast';
import { DetalleFacturaForm } from '../Reserva/Form/DetalleFacturaForm';
import ReservaService from '../../services/ReservaService';
import HorarioService from '../../services/HorarioService';
import ServicioService from '../../services/ServicioService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Reserva/DatePickerCustomStyles.css';
export function CrearReserva() {
  const navigate = useNavigate();
  const [dataServicio, setDataServicio] = useState([]);
  const [nextId, setNextId] = useState(0);
  const [loadedServicio, setLoadedServicio] = useState(false);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [loadedUsuario, setLoadedUsuario] = useState(false);
  const [dataSucursales, setDataSucursales] = useState([]);
  const [loadedSucursales, setLoadedSucursales] = useState(false);
  const [dataCliente, setDataCliente] = useState([]);
  const [loadedCliente, setLoadedCliente] = useState(false);
  const [dataencargado, setDataencargado] = useState([]);
  const [loadedencargado, setLoadedencargado] = useState(false);
  const codigo = 0;
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({ nombre: '', correo_electronico: '' });
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [dataHorarios, setDataHorarios] = useState([]);
  const [estados] = useState(['Pendiente', 'Confirmada', 'Reprogramada', 'Completada', 'Cancelada', 'No asistió']);
  const [tiempoServicio, setTiempoServicio] = useState('');

  const validateHorarios = (selectedHorarios, tiempoServicio, horarios) => {
    if (!Array.isArray(selectedHorarios) || typeof tiempoServicio !== 'number' || !Array.isArray(horarios)) {
      console.error('Invalid input types');
      return false;
    }

    if (!tiempoServicio) return true;

    const sortedHorarios = selectedHorarios
      .map(id => horarios.find(h => h.id === id))
      .filter(h => h !== undefined)
      .sort((a, b) => new Date(`1970-01-01T${a.hora_inicio}`) - new Date(`1970-01-01T${b.hora_inicio}`));

    console.log('Sorted Horarios:', sortedHorarios);

    if (sortedHorarios.length !== tiempoServicio) {
      toast.error('El número de horarios seleccionados no coincide con el tiempo de servicio');
      return false;
    }

    for (let i = 0; i < sortedHorarios.length - 1; i++) {
      const currentEnd = new Date(`1970-01-01T${sortedHorarios[i].hora_fin}`);
      const nextStart = new Date(`1970-01-01T${sortedHorarios[i + 1].hora_inicio}`);
      if (currentEnd.getTime() !== nextStart.getTime()) {
        toast.error('Los horarios seleccionados no son contiguos');
        return false;
      }
    }

    return true;
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await SucursalService.getSucursal();
        setDataSucursales(response.data.results);
        setLoadedSucursales(true);
      } catch (error) {
        console.error('Error fetching sucursales:', error);
        toast.error('Error al cargar sucursales');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (codigo === 0) {
      FacturaService.getNextId()
        .then((response) => {
          console.log("Próximo ID obtenido:", response.data.results.Codigo);
          setNextId(response.data.results.Codigo);
        })
        .catch((error) => {
          console.error("Error al obtener el próximo ID:", error);
          if (error instanceof SyntaxError) {
            setError(error);
            throw new Error("Respuesta no válida del servidor");
          }
        });
    }
  }, [codigo]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await UsuarioService.getUsers();
        setDataUsuario(response.data.results);
        setLoadedUsuario(true);
      } catch (error) {
        console.error('Error fetching Usuario:', error);
        toast.error('Error al cargar Usuario');
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await UsuarioService.getallClientes();
        setDataCliente(response.data.results);
        setLoadedCliente(true);
      } catch (error) {
        console.error('Error fetching Cliente:', error);
        toast.error('Error al cargar Cliente');
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await UsuarioService.getallencargado();
        setDataencargado(response.data.results);
        setLoadedencargado(true);
      } catch (error) {
        console.error('Error fetching Cliente:', error);
        toast.error('Error al cargar Cliente');
      }
    }
    fetchData();
  }, []);


  const reservaSchema = yup.object().shape({
    sucursal_id: yup.string().required('La sucursal es requerida'),
    dia: yup.date().required('El día es requerido'),
    servicio_id: yup.string().required('El servicio es requerido'),
    question1: yup.string().required('La pregunta 1 es requerida'),
    question2: yup.string().required('La pregunta 2 es requerida'),
    question3: yup.string().required('La pregunta 3 es requerida'),
    answer1: yup.string().required('La respuesta 1 es requerida'),
    answer2: yup.string().required('La respuesta 2 es requerida'),
    answer3: yup.string().required('La respuesta 3 es requerida'),
    encargado_id: yup.string().required('El encargado  es requerido'),
    tiempo_servicio: yup.number().required('El tiempo de servicio es requerido').positive('El tiempo de servicio debe ser positivo').integer('El tiempo de servicio debe ser un número entero'),
    horario_id: yup.array().of(yup.string()).test(
      'horario_id-contiguos',
      'El número de horarios seleccionados debe coincidir con el tiempo de servicio y deben ser horarios continuos',
      function (value) {
        const { tiempo_servicio } = this.parent;
        const horarios = this.options.context?.horarios || [];
        console.log('Context en validación:', horarios);
        return validateHorarios(value, tiempo_servicio, horarios);
      }
    ),
  });

  const today = new Date();
  const currentDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  const {
    control,
    handleSubmit,
    
    watch,
    formState: { errors },
    getValues,
    setValue,
    
    
  } = useForm({
    defaultValues: {
      estado_Reserva: 'Pendiente',
      usuario_id: '',
      servicio_id: '',
      question1: '¿Cuál es la marca y modelo de su vehículo?',
      question2: '¿Ha notado algún problema reciente con su vehículo?',
      question3: '¿Hace cuánto tiempo fue el último mantenimiento?',
      answer1: '',
      answer2: '',
      answer3: '',
      tiempo_servicio: '',
      horario_id: [],
      fecha: currentDate,
      cliente_id: '',
      encargado_id: '',
      sucursal_id: '',
      total: 0,
      subtotaltotal: 0,
      impuesto: 0,
      estado: 0,
      detalle_factura: [
        {
          producto_id: '',
          servicio_id: '',
          cantidad: 1,
          precio: 0,
          subtotal: 0,
        },
      ],
    },
    resolver: yupResolver(reservaSchema),
    context: { horarios: dataHorarios },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientes = await UsuarioService.getallClientes();
        setDataCliente(clientes.data.results);

        const sucursales = await SucursalService.getSucursal();
        setDataSucursales(sucursales.data.results);

        const servicios = await ServicioService.getServicio();
        setDataServicio(servicios.data.results);
        setLoadedServicio(true);
      } catch (error) {
        toast.error('Error al cargar datos iniciales');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTiempoServicio = async (servicioId) => {
      try {
        const response = await ServicioService.get_tiempoServicio(servicioId);
        const tiempo = parseInt(response.data.results.tiempo_servicio, 10);
        console.log('Tiempo de servicio obtenido:', tiempo);
        setTiempoServicio(tiempo);
        setValue('tiempo_servicio', tiempo);
      } catch (error) {
        toast.error('Error al cargar tiempo de servicio');
      }
    };
  
    const servicioId = getValues('servicio_id');
    console.log('Servicio ID actual:', servicioId);
    if (servicioId) {
      fetchTiempoServicio(servicioId);
    }
  }, [getValues('servicio_id')]);

  useEffect(() => {
    // Actualiza el contexto de validación al cambiar `dataHorarios`
    reservaSchema.fields.horario_id.testContext = { horarios: dataHorarios };
    setValue('horario_id', [], { shouldValidate: true });
  }, [dataHorarios]);

  const handleSucursalChange = async (event) => {
    const sucursalId = event.target.value;
    setValue('sucursal_id', sucursalId);
    setValue('dia', null);
    setValue('horario_id', []);

    const diaSeleccionado = getValues('dia');
    if (diaSeleccionado) {
      try {
        const horarios = await HorarioService.getHorarioBySucursal(diaSeleccionado, sucursalId);
        setDataHorarios(horarios.length > 0 ? horarios : []);
        if (horarios.length === 0) toast.error('No se encontraron horarios para la sucursal seleccionada y el día especificado');
      } catch (error) {
        toast.error('Error al cargar horarios');
      }
    }
  };

  const handleDiaChange = async (date) => {
    setValue('dia', date);
    setValue('horario_id', []);

    const sucursalId = getValues('sucursal_id');
    if (sucursalId) {
      try {
        const horarios = await HorarioService.getHorarioBySucursal(date, sucursalId);
        setDataHorarios(horarios.length > 0 ? horarios : []);
        if (horarios.length === 0) toast.error('No se encontraron horarios para la sucursal seleccionada y el día especificado');
      } catch (error) {
        toast.error('Error al cargar horarios');
      }
    }
  };


  const handleServicioChange = async (e) => {
    const servicioId = e.target.value;
    setValue('servicio_id', servicioId);
    setValue('horario_id', []);

    try {
      const response = await ServicioService.get_tiempoServicio(servicioId);
      setTiempoServicio(parseInt(response.data.results.tiempo_servicio, 10));
    } catch (error) {
      toast.error('Error al cargar tiempo de servicio');
    }
  };
  useEffect(() => {
    // Actualiza la información del usuario seleccionado basado en `cliente_id`
    const selectedUser = dataCliente.find(user => user.id === watch('cliente_id'));
    if (selectedUser) {
      setUsuarioSeleccionado({ nombre: selectedUser.nombre, correo_electronico: selectedUser.correo_electronico });
    }
  }, [watch('cliente_id')]);

 
  

  const handleInputChange = useCallback((index, name, value) => {
    console.log(`Manejo de cambio - Índice: ${index}, Nombre: ${name}, Valor: ${value}`);
    
    let impuesto = 0;
    let subtotal = 0;
    let subtotaltotal = 0;
    if (dataServicio && value) {
      let item =dataServicio.find((item) => item.id === value);

      if (item) {
        console.log(`Item seleccionado: ${item.nombre}, Precio: ${item.tarifa}`);
        setValue(`detalle_factura.${index}.precio`, parseFloat(item.tarifa));
      }
    }
    
    
    const currentDetalleFactura = watch('detalle_factura');
  
    if (currentDetalleFactura[index]) {
      subtotal = parseFloat(currentDetalleFactura[index].cantidad) * parseFloat(currentDetalleFactura[index].precio || 0);
      console.log(`Subtotal calculado para el índice ${index}: ${subtotal}`);
      setValue(`detalle_factura.${index}.subtotal`, subtotal);
    }
  
    subtotaltotal = currentDetalleFactura.reduce((acc, item) => acc + (parseFloat(item.subtotal) || 0), 0);
    console.log(`Subtotal total: ${subtotaltotal}`);
    setValue('subtotaltotal', subtotaltotal);
  
    impuesto = subtotaltotal * 0.13;
    console.log(`Impuesto total: ${impuesto}`);
    setValue('impuesto', impuesto);
  
    const total = subtotaltotal + impuesto;
    console.log(`Total calculado: ${total}`);
    setValue('total', total);
  }, [dataServicio, setValue, watch]);
  
const { fields, append, remove } = useFieldArray({
  control,
  name: 'detalle_factura',
});
// Sincronizar servicio_id en detalle_factura cuando cambia servicio_id en la reserva principal
useEffect(() => {
  const subscription = watch((value, { name, type }) => {
    if (name === 'servicio_id') {
      const servicio_id = value.servicio_id;
      fields.forEach((field, index) => {
        setValue(`detalle_factura.${index}.servicio_id`, servicio_id);
      });
    }
  });
  return () => subscription.unsubscribe();
}, [watch, fields, setValue]);


const removeDetalleFactura = useCallback((index) => {
  if (fields.length > 1) {
    console.log(`Eliminando detalle en índice: ${index}`);
    remove(index);
  } else {
    console.log('No se puede eliminar el único detalle presente');
  }
}, [fields.length, remove]);


useEffect(() => {
  if (servicioSeleccionado) {
    fields.forEach((field, index) => {
      handleInputChange(index, `detalle_factura.${index}.servicio_id`, servicioSeleccionado);
    });
  }
}, [servicioSeleccionado, fields, handleInputChange]);


  const [onError, setError] = useState('');

  // Acción submit
  const onSubmit = (DataForm) => {
    DataForm.date=`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    console.log('Formulario:');
    console.log(DataForm);

    try {
      if (reservaSchema.isValid()) {
        // Crear reserva
        ReservaService.createReserva(DataForm)
        
          .then((response) => {
            console.log(response);
            setError(response.error);
            // Respuesta al usuario de creación
            if (response.data.results != null) {
              toast.success(response.data.results, {
                duration: 4000,
                position: 'top-center',
              });
              // Redireccion a la tabla
              return navigate('/ListaReservas');
            }
          })
          .catch((error) => {
            if (error instanceof SyntaxError) {
              console.log(error);
              setError(error);
              throw new Error('Respuesta no válida del servidor');
            }
          });
      }
    } catch (e) {
      // Capturar error
    }
  };

  return (
    <Container maxWidth="lg"> {/* Cambiado a lg para mayor ancho */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <div style={{ marginTop: '60px' }}></div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant='h4' gutterBottom>
              Crear Reserva
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='fecha'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='fecha'
                    label='Fecha'
                    error={Boolean(errors.fecha)}
                    helperText={errors.fecha ? errors.fecha.message : ' '}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='id'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='id'
                    label='ID'
                    error={Boolean(errors.id)}
                    helperText={errors.id ? errors.id.message : ''}
                    value={nextId}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name="cliente_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Cliente"
                    variant="outlined"
                    fullWidth
                  >
                    {dataCliente.map((usuario) => (
                      <MenuItem key={usuario.id} value={usuario.id}>
                        {usuario.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <FormHelperText>{errors.cliente_id?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <TextField
                label='Nombre de Cliente'
                value={usuarioSeleccionado.nombre}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <TextField
                label='Email de Cliente'
                value={usuarioSeleccionado.correo_electronico}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name="encargado_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Encargado"
                    variant="outlined"
                    fullWidth
                  >
                    {dataencargado.map((usuario) => (
                      <MenuItem key={usuario.id} value={usuario.id}>
                        {usuario.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <FormHelperText>{errors.cliente_id?.message}</FormHelperText>
            </FormControl>
          </Grid>
       
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.sucursal_id}>
              <Controller
                name="sucursal_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Sucursal"
                    {...field}
                    onChange={(e) => handleSucursalChange(e)}
                    variant="outlined"
                    fullWidth
                  >
                    {dataSucursales.map((sucursal) => (
                      <MenuItem key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <FormHelperText>{errors.sucursal_id?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="dia"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value}
                  onChange={(date) => handleDiaChange(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Selecciona una fecha"
                  minDate={new Date()}
                  customInput={
                    <TextField
                      fullWidth
                      label="Día"
                      error={!!errors.dia}
                      helperText={errors.dia?.message}
                    />
                  }
                />
              )}
            />
          </Grid>


          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.servicio_id}>
              <Controller
                name="servicio_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Servicio"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setServicioSeleccionado(e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                  >
                    {dataServicio.map((servicio) => (
                      <MenuItem key={servicio.id} value={servicio.id}>
                        {servicio.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <FormHelperText>{errors.servicio_id?.message}</FormHelperText>
            </FormControl>
          </Grid>


          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.tiempo_servicio}>
              <Controller
                name="tiempo_servicio"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="number"
                    label="Tiempo de Servicio (horas)"
                    {...field}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true
                    }}
                  />
                )}
              />
              <FormHelperText>{errors.tiempo_servicio?.message}</FormHelperText>
            </FormControl>
          </Grid>

          
         
          <Grid item xs={12}>
              <Typography component="h2" variant="h6">
                Seleccionar Horarios
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    {dataHorarios.map((horario) => (
                      <TableRow key={horario.id}>
                        <TableCell>
                        <FormControl component="fieldset" error={!!errors.horario_id}>
                          <FormControlLabel
                            control={
                              <Controller
                                name="horario_id"
                                control={control}
                                defaultValue={[]}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    value={horario.id}
                                    checked={field.value.includes(horario.id)}
                                    color="primary"
                                    onChange={(e) => {
                                      const selected = field.value;
                                      if (e.target.checked) {
                                        setValue('horario_id', [...selected, horario.id]);
                                      } else {
                                        setValue('horario_id', selected.filter((id) => id !== horario.id));
                                      }
                                    }}
                                  />
                                )}
                              />
                            }
                            label={`${horario.hora_inicio} - ${horario.hora_fin}`}
                          />
                          {errors.horario_id && (
                  <FormHelperText>{errors.horario_id.message}</FormHelperText>
                )}
              </FormControl>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name="question1"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Pregunta 1"
                  fullWidth
                  disabled
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Controller
              name="answer1"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Respuesta 1"
                  fullWidth
                  error={Boolean(errors.answer1)}
                  helperText={errors.answer1?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="question2"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Pregunta 2"
                  fullWidth
                  disabled
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Controller
              name="answer2"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Respuesta 2"
                  fullWidth
                  error={Boolean(errors.answer2)}
                  helperText={errors.answer2?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="question3"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Pregunta 3"
                  fullWidth
                  disabled
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Controller
              name="answer3"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Respuesta 3"
                  fullWidth
                  error={Boolean(errors.answer3)}
                  helperText={errors.answer3?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' gutterBottom>
              Detalles de la Factura
              
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label='Detalles de Factura'>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'success.main' }}>
                    <TableCell>#</TableCell>
                    <TableCell style={{ width: 400 }}>Producto/Servicio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Subtotal</TableCell>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadedServicio &&
                    fields.map((field, index) => (
                      <DetalleFacturaForm
                        key={field.id}
                        field={field}
                         name='servicio_id'
                        data={dataServicio}
                        index={index}
                        onRemove={removeDetalleFactura}
                        handleChange={handleInputChange}
                        control={control}
                        disableRemoveButton={fields.length === 0}
                        servicioSeleccionado={servicioSeleccionado}
                        
                      />
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow sx={{ borderTop: 'solid', borderColor: 'success.main' }}>
                    <TableCell colSpan={4} align='right' sx={{ fontWeight: 'bold' }}>
                      Subtotal
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Controller
                        name='subtotaltotal'
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} type='number' variant='standard' fullWidth InputProps={{ readOnly: true }} />
                        )}
                      />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow sx={{ borderTop: 'solid', borderColor: 'success.main' }}>
                    <TableCell colSpan={4} align='right' sx={{ fontWeight: 'bold' }}>
                      Impuesto
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Controller
                        name='impuesto'
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} type='number' variant='standard' fullWidth InputProps={{ readOnly: true }} />
                        )}
                      />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow sx={{ borderTop: 'solid', borderColor: 'success.main' }}>
                    <TableCell colSpan={4} align='right' sx={{ fontWeight: 'bold' }}>
                      Total
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Controller
                        name='total'
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} type='number' variant='standard' fullWidth InputProps={{ readOnly: true }} />
                        )}
                      />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>
<Grid item xs={12}>
            <Button type='submit' variant='contained' color='primary'>
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}




