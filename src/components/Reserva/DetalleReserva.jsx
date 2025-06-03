import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardContent, CardHeader, Divider, Avatar } from '@mui/material';
import logo from '../../assets/logo.jpg';
import ReservaService from '../../services/ReservaService';
import moment from 'moment';

export function DetalleReserva() {
  const routeParams = useParams();
  console.log(routeParams);

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ReservaService.getReservaId(routeParams.id)
      .then(response => {
        setData(response.data.results[0]);  // Asegurarse de tomar el primer elemento de results
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
            <Card sx={{ backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: '#1976d2' }}>
                    {data.usuario.nombre[0]}
                  </Avatar>
                }
                title={
                  <Typography variant='h5' sx={{ color: 'black', fontWeight: 'bold' }}>
                    {data.servicio.nombre}
                  </Typography>
                }
                subheader={`Estado: ${data.estado_Reserva}`}
              />
              <CardContent>
                <Typography variant='subtitle1' gutterBottom color='black'>
                  Sucursal: {data.horario[0].nombre}
                </Typography>
                <Typography variant='subtitle1' gutterBottom color='black'>
                  Usuario: {data.usuario.nombre}
                </Typography>
                <Typography variant='subtitle1' gutterBottom color='black'>
                  Fecha: {moment(data.horario[0].dia_semana).format('LLLL')}
                </Typography>
                <Typography variant='subtitle1' gutterBottom color='black'>
                  Hora: {moment(data.horario[0].hora_inicio, 'HH:mm:ss').format('HH:mm')} - {moment(data.horario[0].hora_fin, 'HH:mm:ss').format('HH:mm')}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '5px' }}>
                  <Typography variant='h6' gutterBottom color='primary'>
                    Preguntas del Cliente
                  </Typography>
                  <Typography variant='body1' gutterBottom color='black'>
                    <strong>{data.question1}</strong>
                    <br />
                    Respuesta: {data.answer1}
                  </Typography>
                  <Typography variant='body1' gutterBottom color='black'>
                    <strong>{data.question2}</strong>
                    <br />
                    Respuesta: {data.answer2}
                  </Typography>
                  <Typography variant='body1' gutterBottom color='black'>
                    <strong>{data.question3}</strong>
                    <br />
                    Respuesta: {data.answer3}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

