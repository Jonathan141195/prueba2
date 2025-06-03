import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import SucursalService from '../../services/SucursalService';
import { toast } from 'react-hot-toast';
import { ProvinciaSelectUpdate } from '../Ubicaciones/ProvinciaSelectUpdate';
import { CantonSelectUpdate } from '../Ubicaciones/CantonSelectUpdate';
import { DistritoSelectUpdate } from '../Ubicaciones/DistritoSelectUpdate';

export function UpdateSucursal() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const [direcciones, setDirecciones] = useState({
    provincia: { id: '', nombre: '' },
    canton: { id: '', nombre: '' },
    distrito: { id: '', nombre: '' },
  });
  const [values, setValues] = useState(null);
  const [error, setError] = useState('');
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);

  const id = routeParams.id || null;

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = () => {
    if (id && !isNaN(Number(id))) {
      SucursalService.getSucursalId(Number(id))
        .then((response) => {
          const { provincia, canton, distrito, ...data } = response.data.results;
          setValues(data);
          fetchProvincia(provincia, canton, distrito);
        })
        .catch((error) => {
          console.error('Error fetching sucursal:', error);
          setError('Error al cargar la sucursal');
        });
    }
  };

  const fetchProvincia = (provinciaId, cantonId, distritoId) => {
    fetch(`https://ubicaciones.paginasweb.cr/provincias.json`)
      .then((response) => response.json())
      .then((data) => {
        setProvincias(data);
        fetchCanton(provinciaId, cantonId, distritoId);
        setDirecciones((prev) => ({
          ...prev,
          provincia: { id: provinciaId.toString(), nombre: data[provinciaId.toString()] },
        }));
      })
      .catch((error) => console.error('Error fetching provincias:', error));
  };

  const fetchCanton = (provinciaId, cantonId, distritoId) => {
    fetch(`https://ubicaciones.paginasweb.cr/provincia/${provinciaId}/cantones.json`)
      .then((response) => response.json())
      .then((data) => {
        setCantones(data);
        fetchDistrito(provinciaId, cantonId, distritoId);
        setDirecciones((prev) => ({
          ...prev,
          canton: { id: cantonId.toString(), nombre: data[cantonId.toString()] },
        }));
      })
      .catch((error) => console.error('Error fetching cantones:', error));
  };

  const fetchDistrito = (provinciaId, cantonId, distritoId) => {
    fetch(`https://ubicaciones.paginasweb.cr/provincia/${provinciaId}/canton/${cantonId}/distritos.json`)
      .then((response) => response.json())
      .then((data) => {
        setDistritos(data);
        setDirecciones((prev) => ({
          ...prev,
          distrito: { id: distritoId.toString(), nombre: data[distritoId.toString()] },
        }));
      })
      .catch((error) => console.error('Error fetching distrito:', error));
  };

  const sucursalSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    telefono: yup.string().required('El teléfono es requerido'),
    direccion: yup.string().required('La dirección es requerida'),
    correo_electronico: yup.string().required('El correo electrónico es requerido').email('El correo electrónico no es válido'),
    provincia: yup.string().typeError('Seleccione una provincia').required('La provincia es requerida'),
    canton: yup.string().typeError('Seleccione un cantón').required('El cantón es requerido'),
    distrito: yup.string().typeError('Seleccione un distrito').required('El distrito es requerido'),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: values?.nombre || '',
      descripcion: values?.descripcion || '',
      telefono: values?.telefono || '',
      direccion: values?.direccion || '',
      correo_electronico: values?.correo_electronico || '',
      provincia: direcciones.provincia?.id || '',
      canton: direcciones.canton?.id || '',
      distrito: direcciones.distrito?.id || '',
    },
    values,
    resolver: yupResolver(sucursalSchema),
  });

  useEffect(() => {
    if (values) {
      setValue('nombre', values.nombre);
      setValue('descripcion', values.descripcion);
      setValue('telefono', values.telefono);
      setValue('direccion', values.direccion);
      setValue('correo_electronico', values.correo_electronico);
      setValue('provincia', direcciones.provincia?.id);
      setValue('canton', direcciones.canton?.id);
      setValue('distrito', direcciones.distrito?.id);
    }
  }, [values, setValue, direcciones]);

  const onSubmit = (formData) => {
    console.log('Form Data:', formData); // Verifica que formData tenga los datos correctos antes de enviarlos al servicio.
    SucursalService.updateSucursal(formData)
      .then((response) => {
        console.log('Response:', response); // Verifica la respuesta del servicio.
        if (response.data.results) {
          toast.success(response.data.results, {
            duration: 4000,
            position: 'top-center',
          });
          navigate('/listaSucursales');
        }
      })
      .catch((error) => {
        console.error('Error updating sucursal:', error);
        setError('Error al actualizar la sucursal');
      });
  };
  
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2} sx={{ mt: 6 }}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Actualizar Sucursal
            </Typography>
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
                    helperText={errors.nombre ? errors.nombre.message : ''}
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
                    label="Descripción"
                    error={Boolean(errors.descripcion)}
                    helperText={errors.descripcion ? errors.descripcion.message : ''}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="telefono"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="telefono"
                    label="Teléfono"
                    error={Boolean(errors.telefono)}
                    helperText={errors.telefono ? errors.telefono.message : ''}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="direccion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="direccion"
                    label="Dirección"
                    error={Boolean(errors.direccion)}
                    helperText={errors.direccion ? errors.direccion.message : ''}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <ProvinciaSelectUpdate
                control={control}
                field={{ value: direcciones.provincia?.id }}
                error={Boolean(errors.provincia)}
                setDirecciones={setDirecciones}
                provincias={provincias}
                setCantones={setCantones}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <CantonSelectUpdate
                control={control}
                field={{ value: direcciones.canton?.id }}
                error={Boolean(errors.canton)}
                setDirecciones={setDirecciones}
                idProvincia={direcciones.provincia?.id}
                cantones={cantones}
                setDistritos={setDistritos}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <DistritoSelectUpdate
                control={control}
                field={{ value: direcciones.distrito?.id }}
                error={Boolean(errors.distrito)}
                setDirecciones={setDirecciones}
                distritos={distritos}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button type="submit" variant="contained" color="primary">
              Guardar Cambios
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}











