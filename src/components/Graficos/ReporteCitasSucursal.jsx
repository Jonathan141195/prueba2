import { PieChart } from '@mui/x-charts';
import { useState, useEffect } from 'react';
import SucursalService from '../../services/SucursalService';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

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

export function ReporteCitasSucursal() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    SucursalService.getCitasbySucursal()
      .then((response) => {
        console.log(response.data);
        const groupedData = groupBySucursal(response.data.results);
        setData(groupedData);
        setColors(generateColors(groupedData.length));
        setLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        setError('Error al obtener los datos del servidor');
        setLoaded(false);
      });
  }, []);

  const groupBySucursal = (data) => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.nombre_sucursal]) {
        acc[item.nombre_sucursal] = 0;
      }
      acc[item.nombre_sucursal] += parseInt(item.cantidad_citas, 10);
      return acc;
    }, {});

    return Object.entries(grouped).map(([nombre_sucursal, cantidad_citas]) => ({
      nombre_sucursal,
      cantidad_citas,
    }));
  };

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

  // Preparar los datos para el gráfico de pastel
  const pieChartData = data.map((item, index) => ({
    value: item.cantidad_citas,
    label: item.nombre_sucursal,
    color: colors[index],
  }));

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%', padding: '20px' }}>
      <Card sx={{ boxShadow: '0px 0px 10px 3px #5271FF', textAlign: 'center', width: '80%', margin: '20px auto', borderRadius: 3 }}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
          <Typography variant="h5" component="h2" style={{ marginBottom: '20px' }}>
            Gráfico de Pastel de Citas por Sucursal
          </Typography>
          <PieChart
            series={[
              {
                data: pieChartData.map(item => ({ value: item.value, label: item.label, color: item.color })),
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
                {item.nombre_sucursal}
              </Typography>
              <Typography variant="h6" component="p">
                {item.cantidad_citas}
              </Typography>
            </ColoredPaper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}



