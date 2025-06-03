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
import ServicioService from '../../services/ServicioService';
import { toast } from 'react-hot-toast';

export function UpdateServicio() {
  const navigate = useNavigate();
  const niveles = ["Alto", "Medio", "Bajo"]; // Definir los niveles
  const routeParams = useParams();
  const id = routeParams.id || null;
  const [values, setValores] = useState(null);
  const [error, setError] = useState('');

  // Obtener la pelicula del API
  useEffect(() => {
    if (id !== undefined && !isNaN(Number(id))) {
      ServicioService.getServicioId(Number(id))
        .then((response) => {
          console.log('Servicio:', response);
          setValores(response.data.results);
          setError('');
        })
        .catch((error) => {
          console.log(error);
          setError('Error al obtener el servicio');
        });
    }
  }, [id]);

  // Esquema de validación
  const servicioSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    tarifa: yup.number().typeError('Solo acepta números').required('El precio es requerido').positive('Solo acepta números positivos'),
    tiempo_servicio: yup.number().typeError('Solo acepta números').required('El tiempo de servicio es requerido').positive('Solo acepta números positivos'),
    nivel_dificultad: yup.string().oneOf(niveles, 'Selecciona una dificultad válida').required('La dificultad de servicio es requerida'),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      tarifa: '',
      tiempo_servicio: '',
      tipo_vehiculo: '',
      nivel_dificultad: '',
    },
    values,
    resolver: yupResolver(servicioSchema),
  });

  const onSubmit = async (DataForm) => {
    console.log('Formulario:', DataForm);

    try {
      const isValid = await servicioSchema.isValid(DataForm);
      if (isValid) {
        ServicioService.updateServicio(DataForm)
          .then((response) => {
            console.log(response);
            setError(response.error || '');
            if (response.data.results != null) {
              toast.success('Servicio actualizado correctamente', {
                duration: 4000,
                position: 'top-center',
              });
              navigate('/listaServicios');
            } else {
              toast.error('Error al actualizar el servicio', {
                duration: 4000,
                position: 'top-center',
              });
            }
          })
          .catch((error) => {
            console.log(error);
            setError('Error al actualizar el servicio');
            toast.error('Error al actualizar el servicio', {
              duration: 4000,
              position: 'top-center',
            });
          });
      } else {
        toast.error('Formulario no válido', {
          duration: 4000,
          position: 'top-center',
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('Ocurrió un error', {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2} sx={{ mt: 6 }}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Actualizar Servicio
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
                    InputProps={{ readOnly: true }}
                    error={Boolean(errors.nombre)}
                    helperText={errors.nombre ? errors.nombre.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="nombre"
                    label="Nombre"
                    error={Boolean(errors.nombre)}
                    helperText={errors.nombre ? errors.nombre.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="descripcion"
                    label="Descripcion"
                    error={Boolean(errors.descripcion)}
                    helperText={errors.descripcion ? errors.descripcion.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="tiempo_servicio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="tiempo_servicio"
                    label="Tiempo de Servicio"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    error={Boolean(errors.tiempo_servicio)}
                    helperText={errors.tiempo_servicio ? errors.tiempo_servicio.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="tipo_vehiculo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="tipo_vehiculo"
                    label="Tipo Vehiculo"
                    error={Boolean(errors.tipo_vehiculo)}
                    helperText={errors.tipo_vehiculo ? errors.tipo_vehiculo.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="tarifa"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="tarifa"
                    label="Tarifa"
                    error={Boolean(errors.tarifa)}
                    helperText={errors.tarifa ? errors.tarifa.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="nivel_dificultad"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    id="nivel_dificultad"
                    label="Dificultad de Servicio"
                    onChange={(e) =>
                      setValue('nivel_dificultad', e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    SelectProps={{ native: true }}
                    error={Boolean(errors.nivel_dificultad)}
                    helperText={errors.nivel_dificultad ? errors.nivel_dificultad.message : ' '}
                  >
                    <option value="">Seleccione</option>
                    {niveles.map((nivel) => (
                      <option key={nivel} value={nivel}>
                        {nivel}
                      </option>
                    ))}
                  </TextField>
                )}
              />
              <FormHelperText sx={{ color: '#d32f2f' }}>
                {errors.nivel_dificultad ? errors.nivel_dificultad.message : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

