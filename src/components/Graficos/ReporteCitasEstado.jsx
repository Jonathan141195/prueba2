import { PieChart } from '@mui/x-charts';
import { useState, useEffect, useContext } from 'react';
import ReservaService from '../../services/ReservaService';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { UserContext } from '../../context/UserContext'; // Importa el contexto

// Crear un componente Paper estilizado
const ColoredPaper = styled(Paper)(({ theme, color }) => ({
  padding: '10px',
  textAlign: 'center',
  backgroundColor: color,
  borderRadius: '8px',
  color: theme.palette.getContrastText(color),
  width: '150px', // Ancho más pequeño
  marginBottom: '10px',
}));

export function ReporteCitasEstado() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [colors, setColors] = useState([]);

  // Información del usuario
  const { user, decodeToken, autorize } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  useEffect(() => {
    setUserData(decodeToken());
  }, [user]);

  useEffect(() => {
    if (userData?.id) {
      console.log('Fetching data for user id:', userData.id);
      ReservaService.getReservaByEstado(userData.id) // Asegúrate de pasar el ID directamente
        .then((response) => {
          console.log('API response:', response.data);
          setData(response.data.results);
          setColors(generateColors(response.data.results.length));
          setLoaded(true);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setError('Error al obtener los datos del servidor');
          setLoaded(false);
        });
    }
  }, [userData]);

  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(`hsl(${(i * 360) / numColors}, 70%, 50%)`);
    }
    return colors;
  };

  if (!loaded) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );
  if (error) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Typography variant="h6" color="error">{error}</Typography>
    </Box>
  );

  console.log('Data to be used in chart:', data);

  // Preparar los datos para el gráfico de pastel
  const pieChartData = data.map((item, index) => ({
    value: parseInt(item.total_citas, 10),
    label: item.estado_Reserva,
    color: colors[index],
  }));

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%', padding: '20px' }}>
      <Card sx={{ boxShadow: '0px 0px 10px 3px #5271FF', textAlign: 'center', width: '80%', margin: '20px auto', borderRadius: 3 }}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
          <Typography variant="h5" component="h2" style={{ marginBottom: '20px' }}>
            Gráfico de Pastel de Citas por Estado de Reserva
          </Typography>
          <PieChart
            series={[
              {
                data: pieChartData,
              },
            ]}
            tooltip={{ trigger: 'item' }}
            height={400}
            style={{ maxWidth: '90%' }}
          />
        </CardContent>
      </Card>
      <Grid container spacing={2} sx={{ width: '100%', margin: '20px auto', justifyContent: 'flex-start' }}>
        {data.map((item, index) => (
          <Grid item key={index}>
            <ColoredPaper color={colors[index]}>
              <Typography variant="subtitle2" component="p">
                {item.estado_Reserva}
              </Typography>
              <Typography variant="h6" component="p">
                {item.total_citas}
              </Typography>
            </ColoredPaper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}


