import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import ProductoService from '../../services/ProductoService'; // Asegúrate de implementar el servicio
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function ReporteTopProductos() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ProductoService.getTopProductos()
      .then((response) => {
        setData(response.data.results);
        setLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        setError('Error al obtener los datos del servidor');
        setLoaded(false);
      });
  }, []);

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

  const labels = data.map(item => item.producto);
  const valores = data.map(item => item.cantidad_vendida);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Cantidad Vendida',
        data: valores,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 3 Productos Más Vendidos',
      },
    },
  };

  return (
    <Card sx={{ boxShadow: '0px 0px 10px 3px #5271FF', textAlign: 'center', width: '80%', margin: '40px auto 20px auto', borderRadius: 3 }}>
      <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px', paddingTop: '40px' }}>
        <Typography variant="h5" component="h2" style={{ marginBottom: '20px' }}>
          Top 3 Productos Más Vendidos
        </Typography>
        <Box style={{ width: '100%', maxWidth: '90%', marginTop: '60px' }}>
          <Bar data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
}
