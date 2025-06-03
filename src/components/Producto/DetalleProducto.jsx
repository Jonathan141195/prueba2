import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Box } from '@mui/material';
import logo from '../../assets/logo.jpg';
import { PDFDownloadLink, Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import ProductoService from '../../services/ProductoService';
import PropTypes from 'prop-types';

export const DetalleProducto = () => {
  const routeParams = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ProductoService.getProductoId(routeParams.id)
      .then((response) => {
        setData(response.data.results);
        setError(null);
        setLoaded(true);
      })
      .catch((error) => {
        setError(error);
        setLoaded(true);
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const MyDocument = ({ data }) => {
    const styles = StyleSheet.create({
      page: {
        fontFamily: 'Helvetica',
        fontSize: 12,
        paddingTop: 30,
        paddingLeft: 60,
        paddingRight: 60,
        paddingBottom: 30,
      },
      header: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      logo: {
        width: 100,
        height: 100,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 12,
        marginBottom: 5,
      },
    });

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image src={logo} style={styles.logo} />
            <View>
              <Text style={styles.title}>DETALLE DE PRODUCTO</Text>
              <Text style={styles.subtitle}>Nombre: {data.nombre}</Text>
              <Text style={styles.subtitle}>Marca: {data.marca}</Text>
              <Text style={styles.subtitle}>Descripción: {data.descripcion}</Text>
              {data.Categoria ? (
                <Text style={styles.subtitle}>Categoría: {data.Categoria.descripcion}</Text>
              ) : (
                <Text style={styles.subtitle}>Categoría: No especificada</Text>
              )}
              <Text style={styles.subtitle}>Modelo: {data.modelo}</Text>
              <Text style={styles.subtitle}>Precio: ₡{data.precio}</Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <Grid container sx={{ p: 12 }}>
      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div style={{ marginBottom: '50px', marginTop: '100px', backgroundColor: 'white', width: '100%', padding: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'black' }}>DETALLE DE PRODUCTO</div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Box component="img" sx={{ borderRadius: '4%', maxWidth: '100%', height: 'auto' }} alt="Logo" src={logo} />
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9} sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle1" component="h1" gutterBottom color="black">
                  <span style={{ fontWeight: 'bold' }}>Nombre: </span>
                  {data.nombre}
                </Typography>
                <Typography variant="subtitle1" component="h1" gutterBottom color="black">
                  <span style={{ fontWeight: 'bold' }}>Marca: </span>
                  {data.marca}
                </Typography>
                <Typography variant="subtitle1" component="h1" gutterBottom color="black">
                  <span style={{ fontWeight: 'bold' }}>Descripción: </span>
                  {data.descripcion}
                </Typography>
                <Typography component="span" variant="subtitle1" display="block" color="black">
                  <span style={{ fontWeight: 'bold' }}>Categoría: </span>
                  {data.Categoria ? data.Categoria.descripcion : 'No especificada'}
                </Typography>
                <Typography variant="subtitle1" component="h1" gutterBottom color="black">
                  <span style={{ fontWeight: 'bold' }}>Modelo: </span>
                  {data.modelo}
                </Typography>
                <Typography variant="subtitle1" component="h1" gutterBottom color="black">
                  <span style={{ fontWeight: 'bold' }}>Precio: </span>
                  ₡{data.precio}
                </Typography>
              </Grid>
            </Grid>
            <PDFDownloadLink document={<MyDocument data={data} />} fileName="detalle_producto.pdf">
              {({ loading }) => (
                <div style={{ textAlign: 'center' }}>
                  <button
                    style={{
                      marginTop: '20px',
                      padding: '10px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      textAlign: 'center',
                      textDecoration: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    {loading ? 'Generando PDF...' : 'Descargar PDF'}
                  </button>
                </div>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </Grid>
  );
};

DetalleProducto.propTypes = {
  data: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    marca: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    Categoria: PropTypes.shape({
      descripcion: PropTypes.string.isRequired,
    }),
    modelo: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
  }).isRequired,
};




