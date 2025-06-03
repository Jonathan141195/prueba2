/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FormHelperText } from '@mui/material';
import UserService from '../../services/UsuarioService'
import InputMask from 'react-input-mask';
import 'react-datepicker/dist/react-datepicker.css';

export function Signup () {
  const navigate = useNavigate()
  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  
  // Esquema de validación
  const loginSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').max(100, 'El nombre no puede tener más de 100 caracteres'),
    identificacion: yup.string().required('La identificacion es requerida').max(100, 'La identifiacion no puede tener más de 100 caracteres'),
    correo_electronico: yup.string().email('El correo electrónico debe ser válido').required('El correo electrónico es requerido').max(100, 'El correo electrónico no puede tener más de 100 caracteres'),
    direccion: yup.string().required('La dirección es requerida').max(200, 'La dirección no puede tener más de 200 caracteres'),
    fecha_nacimiento: yup.date().required('La fecha de nacimiento es requerida').max(getCurrentDate(), 'La fecha de nacimiento no puede ser futura'),
    contrasena: yup.string().required('La contraseña es requerida').min(8, 'La contraseña debe tener al menos 8 caracteres').max(255, 'La contraseña no puede tener más de 255 caracteres'),
    
    telefono: yup.string()
      
      .required("El número de teléfono es obligatorio"),
  })
  const { control, handleSubmit, setValue, formState: { errors } } =
  useForm({
    // Valores iniciales
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
    // Asignación de validaciones
    resolver: yupResolver(loginSchema)
  })

  
  const [error, setError] = useState('');
  const notify = () => toast.success('Usuario registrado', {
    duration: 4000,
    position: 'top-center'
  })
 // Accion submit
  const onSubmit = (DataForm) => {
    try {
     console.log(DataForm)
     //Registrar usuario
     setValue('rol_id',1)
     UserService.createUser(DataForm)
     .then(response => {
       console.log(response)
       notify()
       return navigate('/user/login/')
        
     })
     .catch(error => {
       if (error instanceof SyntaxError) {
         console.log(error)
         setError(error)
         throw new Error('Respuesta no válida del servidor')
       }
     });
     
    } catch (e) {
      // handle your error
    }
  }
  
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e)
  
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
     <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={2} sx={{ mt: 6 }}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>Registrar Usuario</Typography>
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
         

          <Grid item xs={12} mt={2}>
            <Button type="submit" variant="contained">Crear Usuario</Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}