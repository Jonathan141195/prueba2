import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import logo from '../../assets/logo.jpg';
import ServicioService from '../../services/ServicioService';

export function DetalleServicio() {
  const routeParams = useParams();
  console.log(routeParams);

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ServicioService.getServicioId(routeParams.id)
      .then(response => {
        setData(response.data.results);
        console.log(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch(error => {
        console.log(error);
        setError(error);
        throw new Error("Respuesta no válida del servidor");
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container component='main' sx={{ mt: 12, mb: 2 }}>
      {data && (
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={10} md={5} sx={{ textAlign: 'center' }}>
            <Box component='img'
              sx={{
                borderRadius: '4%',
                maxWidth: '70%',
                height: 'auto',
              }}
              alt="Logo"
              src={logo} />
          </Grid>
          <Grid item xs={12} md={7} sx={{ textAlign: 'center' }}>
            <Box sx={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
              <Typography variant='h4' component='h1' gutterBottom color='black'>
                {data.nombre}
              </Typography>
              <Typography variant='subtitle1' component='h2' gutterBottom color='black'>
                Descripción: {data.descripcion}
              </Typography>
              <Typography variant='subtitle1' component='h2' gutterBottom color='black'>
                Tarifa: ₡{data.tarifa}
              </Typography>
              <Typography variant='subtitle1' component='h2' gutterBottom color='black'>
                Tiempo de Servicio: {data.tiempo_servicio} horas
              </Typography>
              <Typography variant='subtitle1' component='h2' gutterBottom color='black'>
                Tipo de Vehículo: {data.tipo_vehiculo}
              </Typography>
              <Typography variant='subtitle1' component='h2' gutterBottom color='black'>
                Nivel de Dificultad: {data.nivel_dificultad}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

