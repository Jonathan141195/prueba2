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
import { useNavigate } from 'react-router-dom';

import ServicioService from '../../services/ServicioService';
import { toast } from 'react-hot-toast';

export function CreateServicio() {
  const niveles = ["Alto", "Medio", "Bajo"]; // Definir los niveles
  const navigate = useNavigate();
  const codigo = 0;
  const [nextId, setNextId] = useState(codigo);

  // Esquema de validación
  const servicioSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    tarifa: yup.number()
      .typeError('Solo acepta números')
      .required('El precio es requerido')
      .positive('Solo acepta números positivos'),
    tiempo_servicio: yup.number()
      .typeError('Solo acepta números')
      .required('El tiempo de servicio es requerido')
      .positive('Solo acepta números positivos'),
    nivel_dificultad: yup.string()
      .oneOf(niveles, 'Selecciona una dificultad válida')
      .required('La dificultad de servicio es requerida'),
  });

  const {
    control,
    handleSubmit,
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
    resolver: yupResolver(servicioSchema),
  });

  const [error, setError] = useState('');
  const onError = (errors, e) => console.log(errors, e);

  const onSubmit = (DataForm) => {
    console.log('Formulario:', DataForm);

    try {
      if (servicioSchema.isValid()) {
        ServicioService.createServicio(DataForm)
          .then((response) => {
            console.log(response);
            setError(response.error);
            if (response.data.results != null) {
              toast.success(response.data.results, {
                duration: 4000,
                position: 'top-center',
              });
              navigate('/mantenimientoServicios');
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
      console.error(e);
    }
  };

  useEffect(() => {
    if (codigo === 0) {
      ServicioService.getNextId()
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

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={2} sx={{ mt: 6 }}>
          <Grid item xs={12}>
            <Typography variant='h5' gutterBottom>
              Crear Servicio
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='nombre'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='nombre'
                    label='Nombre'
                    error={Boolean(errors.nombre)}
                    helperText={errors.nombre ? errors.nombre.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='descripcion'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='descripcion'
                    label='Descripción'
                    error={Boolean(errors.descripcion)}
                    helperText={errors.descripcion ? errors.descripcion.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
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
                    InputProps={{
                      inputProps: { min: 1 },
                    }}
                    error={Boolean(errors.tiempo_servicio)}
                    helperText={errors.tiempo_servicio ? errors.tiempo_servicio.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='tipo_vehiculo'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='tipo_vehiculo'
                    label='Tipo Vehículo'
                    error={Boolean(errors.tipo_Vehiculo)}
                    helperText={errors.tipo_Vehiculo ? errors.tipo_Vehiculo.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='tarifa'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='tarifa'
                    label='Tarifa'
                    error={Boolean(errors.tarifa)}
                    helperText={errors.tarifa ? errors.tarifa.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
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
                    SelectProps={{
                      native: true,
                    }}
                    error={Boolean(errors.nivel_dificultad)}
                    helperText={errors.nivel_dificultad ? errors.nivel_dificultad.message : ' '}
                  >
                    <option value=""></option>
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
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              sx={{ m: 1 }}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}



