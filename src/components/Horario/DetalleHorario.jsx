import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Box } from '@mui/material';
import logo from '../../assets/logo.jpg';
import { PDFDownloadLink, Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import HorarioService from '../../services/HorarioService';
import PropTypes from 'prop-types';

export const DetalleHorario = () => {
  const routeParams = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    HorarioService.getHorarioId(routeParams.id)
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
              <Text style={styles.title}>DETALLE DE HORARIO</Text>
              <Text style={styles.subtitle}>Día: {data.dia_semana}</Text>
              <Text style={styles.subtitle}>Hora Inicio: {data.hora_inicio}</Text>
              <Text style={styles.subtitle}>Hora Fin: {data.hora_fin}</Text>
              <Text style={styles.subtitle}>Estado: {data.estado === '0' ? 'Bloqueado' : 'Disponible'}</Text>
              <Text style={styles.subtitle}>ID de Sucursal: {data.sucursal_id}</Text>
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
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'black' }}>DETALLE DE HORARIO</div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Box component="img" sx={{ borderRadius: '4%', maxWidth: '100%', height: 'auto' }} alt="Logo" src={logo} />
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9} sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle1" component="h1" gutterBottom color="black">
                  <span style={{ fontWeight: 'bold' }}>Día: </span>
                  {data.dia_semana}
                </Typography>
                <Typography variant="subtitle1" component="h1" gutterBottom color="black">
                  <span style={{ fontWeight: 'bold' }}>Hora Inicio: </span>
                  {data.hora_inicio}
                </Typography>
                <Typography variant="subtitle1" component="h1" gutterBottom color="black">
                  <span style={{ fontWeight: 'bold' }}>Hora Fin: </span>
                  {data.hora_fin}
                </Typography>
                <Typography component="span" variant="subtitle1" display="block" color="black">
                  <span style={{ fontWeight: 'bold' }}>Estado: </span>
                  {data.estado === '0' ? 'Bloqueado' : 'Disponible'}
                </Typography>
                <Typography variant="subtitle1" component="h1" gutterBottom color="black">
                  <span style={{ fontWeight: 'bold' }}>ID de Sucursal: </span>
                  {data.sucursal_id}
                </Typography>
              </Grid>
            </Grid>
            <PDFDownloadLink document={<MyDocument data={data} />} fileName="detalle_horario.pdf">
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

DetalleHorario.propTypes = {
  data: PropTypes.shape({
    dia_semana: PropTypes.string.isRequired,
    hora_inicio: PropTypes.string.isRequired,
    hora_fin: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
    sucursal_id: PropTypes.string.isRequired,
  }).isRequired,
};
