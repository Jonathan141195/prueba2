import * as React from 'react';
import { useState, useContext } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../../context/UserContext';
import toast from 'react-hot-toast';
import UserService from '../../services/UsuarioService';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { InputAdornment, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);

  // Esquema de validación
  const loginSchema = yup.object({
    correo_electronico: yup.string()
      .required('El email es requerido')
      .email('Formato email'),
    contrasena: yup.string()
      .required('El password es requerido')
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      correo_electronico: '',
      contrasena: ''
    },
    resolver: yupResolver(loginSchema)
  });

  const [error, setError] = useState('');

  const onSubmit = (DataForm) => {
    try {
      UserService.loginUser(DataForm)
        .then(response => {
          if (response.data.results && response.data.results !== 'Usuario no valido') {
            saveUser(response.data.results);
            toast.success('Bienvenido, usuario', {
              duration: 4000,
              position: 'top-right'
            });
            navigate('/');
          } else {
            toast.error('Usuario NO válido', {
              duration: 4000,
              position: 'top-right'
            });
          }
        })
        .catch(error => {
          if (error instanceof SyntaxError) {
            setError(error);
            throw new Error('Respuesta no válida del servidor');
          }
        });
    } catch (e) {
      console.error(e);
    }
  };

  const onError = (errors, e) => console.log(errors, e);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Toaster />
      <Paper elevation={3} sx={{ maxWidth: 600, margin: 'auto', padding: '20px', borderRadius: '8px' }}>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div style={{ marginTop: '80px' }}></div>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h4' gutterBottom align="center" sx={{ fontWeight: 600 }}>
                ¡Bienvenido!
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant='outlined' fullWidth sx={{ mb: 2 }}>
                <Controller
                  name='correo_electronico'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id='correo_electronico'
                      label='Email'
                      variant="outlined"
                      error={Boolean(errors.correo_electronico)}
                      helperText={errors.correo_electronico ? errors.correo_electronico.message : ' '}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutlineIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant='outlined' fullWidth sx={{ mb: 2 }}>
                <Controller
                  name='contrasena'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id='contrasena'
                      label='Password'
                      type='password'
                      variant="outlined"
                      error={Boolean(errors.contrasena)}
                      helperText={errors.contrasena ? errors.contrasena.message : ' '}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' variant='contained' color='primary' fullWidth sx={{ py: 1.5 }}>
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                ¿No tienes una cuenta? <Link to="/user/create" style={{ textDecoration: 'none', color: '#1976d2' }}>Regístrate aquí</Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
}

