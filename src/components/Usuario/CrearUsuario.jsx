import {  useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormHelperText } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import UsuarioService from "../../services/UsuarioService";

import InputMask from 'react-input-mask';
import 'react-datepicker/dist/react-datepicker.css';

export function CrearUsuario() {
    const navigate = useNavigate();
    

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  
  // Definición del esquema de validación
  const UsuarioSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').max(100, 'El nombre no puede tener más de 100 caracteres'),
    identificacion: yup.string().required('La identificacion es requerida').max(100, 'La identifiacion no puede tener más de 100 caracteres'),
    correo_electronico: yup.string().email('El correo electrónico debe ser válido').required('El correo electrónico es requerido').max(100, 'El correo electrónico no puede tener más de 100 caracteres'),
    direccion: yup.string().required('La dirección es requerida').max(200, 'La dirección no puede tener más de 200 caracteres'),
    fecha_nacimiento: yup.date().required('La fecha de nacimiento es requerida').max(getCurrentDate(), 'La fecha de nacimiento no puede ser futura'),
    contrasena: yup.string().required('La contraseña es requerida').min(8, 'La contraseña debe tener al menos 8 caracteres').max(255, 'La contraseña no puede tener más de 255 caracteres'),
    rol_id: yup.number().required('El rol es requerido').oneOf([1, 2, 3], 'Rol inválido'), // Valores posibles para rol_id
    telefono: yup.string()
      
      .required("El número de teléfono es obligatorio"),
  });
  


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
        nombre: '',
        identificacion:'',
        correo_electronico: '',
        direccion: '',
        fecha_nacimiento: '',
        sucursal_id: '',
        contrasena: '',
        telefono:'',
        rol_id: '',
    },
    resolver: yupResolver( UsuarioSchema),
  });


  const [error, setError] = useState('');
  const onError = (errors, e) => console.log(errors, e);

  const onSubmit = (DataForm) => {
    console.log('Formulario:', DataForm);
    try {
        const isValid =  UsuarioSchema.isValid(DataForm);
        if (isValid) {
          UsuarioService.createUser(DataForm)
            .then((response) => {
              console.log(response);
              setError(response.error || '');
              if (response.data.results != null) {
                toast.success('Usuario actualizado correctamente', { duration: 4000, position: 'top-center' });
                navigate('/mantenimientoUsuario');
              } else {
                toast.error('Error al crear el usuario', { duration: 4000, position: 'top-center' });
              }
            })
            .catch((error) => {
              console.log(error);
              setError('Error al actualizar el usuario');
              toast.error('Error al crear el usuario', { duration: 4000, position: 'top-center' });
            });
        } else {
          toast.error('Formulario no válido', { duration: 4000, position: 'top-center' });
        }
      } catch (e) {
        console.error(e);
        toast.error('Ocurrió un error', { duration: 4000, position: 'top-center' });
      }
    };
  
   

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={2} sx={{ mt: 6 }}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>Crear Usuario</Typography>
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
                    variant="outlined"
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
                name="identificacion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="identificacion"
                    label="Identificacion"
                    variant="outlined"
                    error={Boolean(errors.identificacion)}
                    helperText={errors.identificacion ? errors.identificacion.message : ''}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="correo_electronico"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="correo_electronico"
                    label="Correo Electrónico"
                    variant="outlined"
                    error={Boolean(errors.correo_electronico)}
                    helperText={errors.correo_electronico ? errors.correo_electronico.message : ''}
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
                    variant="outlined"
                    error={Boolean(errors.direccion)}
                    helperText={errors.direccion ? errors.direccion.message : ''}
                  />
                )}
              />
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="fecha_nacimiento"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="fecha_nacimiento"
                    label="Fecha de Nacimiento"
                    type="date"
                    variant="outlined"
                    error={Boolean(errors.fecha_nacimiento)}
                    helperText={errors.fecha_nacimiento ? errors.fecha_nacimiento.message : ''}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          
          
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="contrasena"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="contrasena"
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                    error={Boolean(errors.contrasena)}
                    helperText={errors.contrasena ? errors.contrasena.message : ''}
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
        <InputMask
          {...field}
          mask="(999) 9999-9999"  // Formato de teléfono
          maskChar=" "          // Carácter para espacios vacíos
        >
          {() => (
            <TextField
              id="telefono"
              label="Teléfono"
              variant="outlined"
              error={Boolean(errors.telefono)}
              helperText={errors.telefono ? errors.telefono.message : ''}
            />
          )}
        </InputMask>
      )}
    />
  </FormControl>
</Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="rol_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="rol_id"
                    label="Rol"
                    variant="outlined"
                    error={Boolean(errors.rol_id)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione un Rol</em>
                    </MenuItem>
                    <MenuItem value={1}>Cliente</MenuItem>
                    <MenuItem value={2}>Administrador</MenuItem>
                    <MenuItem value={3}>Encargado</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
            {errors.rol_id && <FormHelperText error>{errors.rol_id.message}</FormHelperText>}
          </Grid>

          <Grid item xs={12} mt={2}>
            <Button type="submit" variant="contained">Crear Usuario</Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}