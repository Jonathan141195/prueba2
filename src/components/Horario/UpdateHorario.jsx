import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormHelperText } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import HorarioService from '../../services/HorarioService';
import { toast } from 'react-hot-toast';
import SeleccionarSucursal from '../Form/SeleccionarSucursal';
import SucursalService from '../../services/SucursalService';
import { Checkbox, FormControlLabel } from '@mui/material';

export function UpdateHorario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sucursales, setSucursales] = useState([]);
  const [values, setValues] = useState(null);
  const [error, setError] = useState('');
  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const dd = String(today.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
};

  const horarioSchema = yup.object({
    dia_semana: yup
    .date()
    .required('El día es requerido')
    .min(getCurrentDate(), 'La fecha no puede ser anterior a la actual'),
    hora_inicio: yup
      .string()
      .required('La hora de inicio es requerida')
      .matches(
        /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
        'La hora debe estar en formato HH:mm:ss'
      )
      .test('hora-inicio-menor-hora-fin', 'La hora de inicio debe ser menor que la hora de fin', function(value) {
        const { hora_fin } = this.parent;
        if (!value || !hora_fin) return true; // Permitir si uno de los valores no está definido
        const inicio = new Date(`2000-01-01T${value}`);
        const fin = new Date(`2000-01-01T${hora_fin}`);
        return inicio < fin;
      }),
    hora_fin: yup
      .string()
      .required('La hora de fin es requerida')
      .matches(
        /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
        'La hora debe estar en formato HH:mm:ss'
      ),
    sucursal_id: yup.number().required('La sucursal es requerida'),
    estado: yup.boolean(), // Validación del estado
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      dia_semana: '',
      hora_inicio: '',
      hora_fin: '',
      sucursal_id: '',
      estado: false, // Valor inicial del checkbox
    },
    values,
    resolver: yupResolver(horarioSchema),
  });

  // Obtener datos del horario si se proporciona un ID válido
  useEffect(() => {
    const fetchHorario = async () => {
      try {
        if (id && !isNaN(Number(id))) {
          const response = await HorarioService.getHorarioId(Number(id));
          const horarioData = response.data.results;
          // Convertir "estado" a booleano
          horarioData.estado = horarioData.estado === '0' ? false : true;
          console.log('Datos del horario:', horarioData);
          setValues(horarioData); // Asignar valores solo cuando se obtiene la data
          setError(response.error);
        }
      } catch (error) {
        console.error('Error fetching horario:', error);
        setError(error.message);
      }
    };

    fetchHorario();
  }, [id]);

  // Obtener lista de sucursales desde el servicio al montar el componente
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await SucursalService.getSucursal();
        if (response.data && response.data.results) {
          setSucursales(response.data.results);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching sucursales:', error);
        setError(error.message);
      }
    };

    fetchSucursales();
  }, []);

  // Función para formatear la hora en HH:mm:ss
  const formatTime = (time) => {
    if (time.length === 5) {
      return time + ':00';
    }
    return time;
  };


// Función para manejar el envío del formulario
const onSubmit = async (dataForm) => {
  try {
    dataForm.hora_inicio = formatTime(dataForm.hora_inicio);
    dataForm.hora_fin = formatTime(dataForm.hora_fin);

    const response = await HorarioService.updateHorario(dataForm);

    if (response.data && response.data.results) {
      // Verificar si hay un mensaje de superposición de horarios
      if (response.data.results === 'El horario se solapa con uno existente') {
        // Mostrar mensaje de error sobre superposición
        toast.error('El horario se solapa con uno existente. Por favor, elige otro horario.');
      } else {
        // Mostrar mensaje de éxito y navegar a la página de mantenimiento
        toast.success(response.data.results, {
          duration: 4000,
          position: 'top-center',
        });
        navigate('/mantenimientoHorario');
      }
    } else {
      // Si la respuesta no tiene data.results definidos
      toast.error('El horario se solapa con uno existente. Por favor, elige otro horario.');
    }
  } catch (error) {
    // Mostrar mensaje de error genérico
    toast.error('El horario se solapa con uno existente. Por favor, elige otro horario.');
    console.error('El horario se solapa con uno existente. Por favor, elige otro horario', error);
  }
};

  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={2} sx={{ mt: 6 }}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Actualizar Horario
            </Typography>
          </Grid>
          <Grid item xs={2} sm={1}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="id"
                    InputProps={{
                      readOnly: true,
                    }}
                    error={Boolean(errors.id)}
                    helperText={errors.id ? errors.id.message : ''}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="dia_semana"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="dia_semana"
                    label="Fecha"
                    type="date"
                    variant="outlined"
                    error={Boolean(errors.dia_semana)}
                    helperText={errors.dia_semana ? errors.dia_semana.message : ''}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="hora_inicio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="hora_inicio"
                    label="Hora de Inicio"
                    type="time"
                    variant="outlined"
                    error={Boolean(errors.hora_inicio)}
                    helperText={errors.hora_inicio ? errors.hora_inicio.message : ''}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }} // 5 min
                    onChange={(e) => field.onChange(formatTime(e.target.value))}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="hora_fin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="hora_fin"
                    label="Hora de Fin"
                    type="time"
                    variant="outlined"
                    error={Boolean(errors.hora_fin)}
                    helperText={errors.hora_fin ? errors.hora_fin.message : ''}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }} // 5 min
                    onChange={(e) => field.onChange(formatTime(e.target.value))}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="sucursal_id"
              control={control}
              render={({ field }) => (
                <SeleccionarSucursal
                  field={field}
                  data={sucursales}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            {errors.sucursal_id && (
              <FormHelperText error>{errors.sucursal_id.message}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Controller
                  name="estado"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={!field.value} // true si es '0' (false), false si es '1' (true)
                      onChange={(e) => field.onChange(!e.target.checked)}
                    />
                  )}
                />
              }
              label="Bloqueado"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Actualizar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}







