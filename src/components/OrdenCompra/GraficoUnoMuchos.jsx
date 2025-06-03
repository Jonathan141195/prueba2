import { PieChart } from '@mui/x-charts';
import { useState, useEffect } from 'react';
import GraficoServices from '../../services/GraficoUnoMuchosServices';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export function GraficoUnoMuchos() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    GraficoServices.getGrafico()
      .then((response) => {
        console.log(response.data);
        setData(response.data.results);
        setLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        setError('Error al obtener los datos del servidor');
        setLoaded(false);
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  const totalMovimientos = data.reduce((total, item) => total + parseInt(item.cantidad_movimientos, 10), 0);

  // Preparar los datos para el gráfico de pastel
  const pieChartData = data.map(item => ({
    value: (parseInt(item.cantidad_movimientos, 10) / totalMovimientos) * 100,
    label: item.producto,
  }));

  return (
    <Card sx={{ boxShadow: '0px 0px 10px 3px #5271FF', textAlign: 'center', width: '50%', margin: '10% auto 0 auto' }}>
      <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <Typography variant="h5" component="h2" style={{ marginBottom: '20px' }}>
            Gráfico de Pastel de Movimientos de Productos
          </Typography>
        </div>
        <PieChart
          series={[
            {
              data: pieChartData,
            },
          ]}
          tooltip={{ trigger: 'item' }}
          height={400}
        />
      </CardContent>
    </Card>
  );
}
