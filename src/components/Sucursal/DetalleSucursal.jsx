import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Container, Box } from '@mui/material';
import fondo from '../../assets/fondo.jpg';
import SucursalService from '../../services/SucursalService';

export function DetalleSucursal() {
  const routeParams = useParams();
  const [direcciones, setDirecciones] = useState({
    provincia: { id: '', nombre: '' },
    canton: { id: '', nombre: '' },
    distrito: { id: '', nombre: '' },
  });
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
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
          setData(data);
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
        // Convierte el objeto de provincias en un array de objetos { id, nombre }
        const provinciasArray = Object.keys(data).map((key) => ({
          id: key,
          nombre: data[key],
        }));
  
        setProvincias(provinciasArray);
        fetchCanton(provinciaId, cantonId, distritoId);
  
        // Encuentra el nombre de la provincia correspondiente al ID recibido
        const provinciaNombre = provinciasArray.find((prov) => prov.id === provinciaId.toString())?.nombre || '';
  
        setDirecciones((prev) => ({
          ...prev,
          provincia: { id: provinciaId.toString(), nombre: provinciaNombre },
        }));
      })
      .catch((error) => console.error('Error fetching provincias:', error));
  };
  

  const fetchCanton = (provinciaId, cantonId, distritoId) => {
    fetch(`https://ubicaciones.paginasweb.cr/provincia/${provinciaId}/cantones.json`)
      .then((response) => response.json())
      .then((data) => {
        // Convierte el objeto de cantones en un array de objetos { id, nombre }
        const cantonesArray = Object.keys(data).map((key) => ({
          id: key,
          nombre: data[key],
        }));
  
        setCantones(cantonesArray);
        fetchDistrito(provinciaId, cantonId, distritoId);
  
        // Encuentra el nombre del cantón correspondiente al ID recibido
        const cantonNombre = cantonesArray.find((cant) => cant.id === cantonId.toString())?.nombre || '';
  
        setDirecciones((prev) => ({
          ...prev,
          canton: { id: cantonId.toString(), nombre: cantonNombre },
        }));
      })
      .catch((error) => console.error('Error fetching cantones:', error));
  };
  

  const fetchDistrito = (provinciaId, cantonId, distritoId) => {
    fetch(`https://ubicaciones.paginasweb.cr/provincia/${provinciaId}/canton/${cantonId}/distritos.json`)
      .then((response) => response.json())
      .then((data) => {
        // Convierte el objeto de distritos en un array de objetos { id, nombre }
        const distritosArray = Object.keys(data).map((key) => ({
          id: key,
          nombre: data[key],
        }));
  
        setDistritos(distritosArray);
  
        // Encuentra el nombre del distrito correspondiente al ID recibido
        const distritoNombre = distritosArray.find((dist) => dist.id === distritoId.toString())?.nombre || '';
  
        setDirecciones((prev) => ({
          ...prev,
          distrito: { id: distritoId.toString(), nombre: distritoNombre },
        }));
        setLoaded(true);
      })
      .catch((error) => console.error('Error fetching distrito:', error));
  };
  
  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

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
              alt="fondo"
              src={fondo} />
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
                Teléfono: {data.telefono}
              </Typography>
              <Typography variant='subtitle1' component='h2' gutterBottom color='black'>
                Dirección: {data.direccion}
              </Typography>
              <Typography variant='subtitle1' component='h2' gutterBottom color='black'>
                Correo Electrónico: {data.correo_electronico}
              </Typography>
              <Typography variant='subtitle1' component='h2' gutterBottom color='black'>
                Provincia: {direcciones.provincia.nombre}
              </Typography>
              <Typography variant='subtitle1' component='h2' gutterBottom color='black'>
                Cantón: {direcciones.canton.nombre}
              </Typography>
              <Typography variant='subtitle1' component='h2' gutterBottom color='black'>
                Distrito: {direcciones.distrito.nombre}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}


