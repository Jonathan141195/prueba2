import { useEffect, useState } from 'react';
import { Grid, FormControl, Typography, TextField, Button,FormHelperText } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import SucursalService from '../../services/SucursalService';
import UsuarioService from '../../services/UsuarioService';
import { toast } from 'react-hot-toast';
import { ProvinciaSelect } from '../Ubicaciones/ProvinciaSelect';
import { CantonSelect } from '../Ubicaciones/CantonSelect';
import { DistritoSelect } from '../Ubicaciones/DistritoSelect';
import SeleccionarUsuario from '../Sucursal/Form/SeleccionarUsuario';

export function CreateSucursal() {
  const navigate = useNavigate();
  const [nextId, setNextId] = useState(0);
  const [direcciones, setDirecciones] = useState({
    provincia: { id: '', nombre: '' },
    canton: { id: '', nombre: '' },
    distrito: { id: '', nombre: '' },
    setProvincia: (provincia) => setDirecciones((prev) => ({ ...prev, provincia })),
    setCanton: (canton) => setDirecciones((prev) => ({ ...prev, canton })),
    setDistrito: (distrito) => setDirecciones((prev) => ({ ...prev, distrito })),
  });

  const sucursalSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    telefono: yup.string().required('El teléfono es requerido'),
    direccion: yup.string().required('La dirección es requerida'),
    correo_electronico: yup.string().required('El correo electrónico es requerido').email('El correo electrónico no es válido'),
    provincia: yup.string().typeError('Seleccione una provincia').required('La provincia es requerida'),
    canton: yup.string().typeError('Seleccione un cantón').required('El cantón es requerido'),
    distrito: yup.string().typeError('Seleccione un distrito').required('El distrito es requerido'),
    usuarios_asignados: yup.array().of(yup.number().required('Debe seleccionar al menos un usuario')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      telefono: '',
      direccion: '',
      correo_electronico: '',
      provincia: '',
      canton: '',
      distrito: '',
      usuarios_asignados: [],
    },
    resolver: yupResolver(sucursalSchema),
  });

  const [error, setError] = useState('');

  const onSubmit = (dataForm) => {
    console.log('Formulario:', dataForm);

    try {
      if (sucursalSchema.isValidSync(dataForm)) {
        SucursalService.createSucursal(dataForm)
          .then((response) => {
            console.log(response);
            if (response.data.results != null) {
              toast.success(response.data.results, {
                duration: 4000,
                position: 'top-center',
              });
              navigate('/listaSucursales');
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
    SucursalService.getNextId()
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
  }, []);

  const [dataUsuario, setDataUsuario] = useState({});
  const [loadedUsuario, setLoadedUsuario] = useState(false);

  useEffect(() => {
    UsuarioService.getSucursalByUsuarionull()
      .then((response) => {
        console.log(response);
        setDataUsuario(response.data.results);
        setLoadedUsuario(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedUsuario(false);
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, []);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2} sx={{ mt: 6 }}>
          <Grid item xs={12}>
            <Typography variant='h5' gutterBottom>
              Crear Sucursal
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
            <FormControl variant='standard' fullWidth>
              <Controller
                name='telefono'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='telefono'
                    label='Teléfono'
                    error={Boolean(errors.telefono)}
                    helperText={errors.telefono ? errors.telefono.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='direccion'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='direccion'
                    label='Dirección'
                    error={Boolean(errors.direccion)}
                    helperText={errors.direccion ? errors.direccion.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='correo_electronico'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='correo_electronico'
                    label='Correo Electrónico'
                    error={Boolean(errors.correo_electronico)}
                    helperText={errors.correo_electronico ? errors.correo_electronico.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='provincia'
                control={control}
                render={({ field }) => (
                  <ProvinciaSelect
                    field={field}
                    error={errors.provincia}
                    direcciones={direcciones}
                    setDirecciones={setDirecciones}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='canton'
                control={control}
                render={({ field }) => (
                  <CantonSelect
                    field={field}
                    error={errors.canton}
                    direcciones={direcciones}
                    setDirecciones={setDirecciones}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='standard' fullWidth>
              <Controller
                name='distrito'
                control={control}
                render={({ field }) => (
                  <DistritoSelect
                    field={field}
                    error={errors.distrito}
                    direcciones={direcciones}
                    setDirecciones={setDirecciones}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <FormControl fullWidth error={Boolean(errors.usuarios_asignados)}>
  <Controller
    name='usuarios_asignados'
    control={control}
    render={({ field }) => (
      <SeleccionarUsuario
        field={field}
        data={loadedUsuario ? dataUsuario : []}
        onChange={(value) => setValue('usuarios_asignados', value)}
      />
    )}
  />
  {errors.usuarios_asignados && (
    <FormHelperText error>{errors.usuarios_asignados.message}</FormHelperText>
  )}
</FormControl>

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

