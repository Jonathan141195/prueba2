import { useState, useEffect } from "react";
import axios from 'axios';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import logo from "../../assets/logo.jpg";
import FacturaService from "../../services/FacturaService";
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

const DetalleOrden = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      FacturaService.getFacturaById(Number(id))
        .then((response) => {
          setData(response.data.results);
          setError(null);
          setLoaded(true);
        })
        .catch((error) => {
          setError(error);
          setLoaded(true);
        });
    }
  }, [id]);

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
      total: {
        marginTop: 20,
        fontSize: 14,
        fontWeight: 'bold',
      },
      table: {
        marginTop: 20,
        marginBottom: 20,
        borderCollapse: 'collapse',
        width: '100%',
      },
      th: {
        backgroundColor: '#f2f2f2',
        padding: 8,
        border: '1px solid #ddd',
        textAlign: 'left',
      },
      td: {
        padding: 8,
        border: '1px solid #ddd',
      },
    });

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image src={logo} style={styles.logo} />
            <View>
              <Text style={styles.title}>FACTURA</Text>
              <Text style={styles.subtitle}>Fecha: {data.fecha}</Text>
              <Text style={styles.subtitle}>Nombre del Proveedor: {data.sucursal.nombre}</Text>
              <Text style={styles.subtitle}>Usuario: {data.usuario.nombre}</Text>
              <Text style={styles.subtitle}>Teléfono: {data.sucursal.telefono}</Text>
              <Text style={styles.subtitle}>Dirección: {data.sucursal.direccion}</Text>
              <Text style={styles.subtitle}>Correo: {data.sucursal.correo_electronico}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={{ flexDirection: 'row', borderBottom: '1px solid #ddd' }}>
              <Text style={[styles.th, { flex: 1 }]}>Tipo</Text>
              <Text style={[styles.th, { flex: 3 }]}>Nombre</Text>
              <Text style={[styles.th, { flex: 2 }]}>Precio</Text>
              <Text style={[styles.th, { flex: 2 }]}>Cantidad</Text>
              <Text style={[styles.th, { flex: 2 }]}>Subtotal</Text>
            </View>
            {data.detalle_factura.map((detalle, index) => (
              <View key={index} style={{ flexDirection: 'row' }}>
                <Text style={[styles.td, { flex: 1 }]}>
                  {detalle.producto_id ? 'Producto' : 'Servicio'}
                </Text>
                <Text style={[styles.td, { flex: 3 }]}>
                  {detalle.producto ? detalle.producto.nombre : 'Servicio'}
                </Text>
                <Text style={[styles.td, { flex: 2 }]}>{detalle.precio}</Text>
                <Text style={[styles.td, { flex: 2 }]}>{detalle.cantidad}</Text>
                <Text style={[styles.td, { flex: 2 }]}>{detalle.subtotal}</Text>
              </View>
            ))}
          </View>

          <View>
            <Text style={styles.total}>Subtotal: {data.subtotaltotal}</Text>
            <Text style={styles.total}>Impuesto: {data.impuesto}</Text>
            <Text style={styles.total}>Total: {data.total}</Text>
          </View>
        </Page>
      </Document>
    );
  };

  MyDocument.propTypes = {
    data: PropTypes.object.isRequired,
  };

  const handleSendPdf = async () => {
    try {
      const blob = await pdf(<MyDocument data={data} />).toBlob();
      const formData = new FormData();
      formData.append('email', data.usuario.correo_electronico);
      formData.append('file', blob, 'factura.pdf');

      await axios.post('http://localhost:3000/send-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('PDF enviado por correo electrónico');
    } catch (error) {
      console.error('Error al enviar el PDF:', error);
      alert('Error al enviar el PDF');
    }
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Grid container sx={{ p: 2 }}>
      {data && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <div style={{ marginBottom: "50px", marginTop: "100px", backgroundColor: "white", width: "100%", padding: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold" color="black">
                  FACTURA
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Box component="img" sx={{ borderRadius: "4%", maxWidth: "100%", height: "auto" }} alt="Logo" src={logo} />
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9} sx={{ textAlign: "left" }}>
                <Typography variant="subtitle1" gutterBottom color="black">
                  <strong>Nombre Proveedor:</strong> {data.sucursal.nombre}
                </Typography>
                <Typography variant="subtitle1" gutterBottom color="black">
                  <strong>Fecha:</strong> {data.fecha}
                </Typography>
                <Typography variant="subtitle1" gutterBottom color="black">
                  <strong>Teléfono:</strong> {data.sucursal.telefono}
                </Typography>
                <Typography variant="subtitle1" gutterBottom color="black">
                  <strong>Dirección:</strong> {data.sucursal.direccion}
                </Typography>
                <Typography variant="subtitle1" gutterBottom color="black">
                  <strong>Correo:</strong> {data.sucursal.correo_electronico}
                </Typography>
                <Typography variant="subtitle1" gutterBottom color="black">
                  <strong>Usuario:</strong> {data.usuario.nombre}
                </Typography>
              </Grid>
            </Grid>
            <div style={{ border: "1px solid black", padding: "10px", width: "100%", marginTop: "20px" }}>
              <Grid container spacing={1} style={{ borderBottom: "1px solid black", paddingBottom: "10px" }}>
                <Grid item md={2}>
                  <Typography variant="subtitle1" gutterBottom color="black" fontWeight="bold">
                    Tipo:
                  </Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography variant="subtitle1" gutterBottom color="black" fontWeight="bold">
                    Nombre:
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography variant="subtitle1" gutterBottom color="black" fontWeight="bold">
                    Precio:
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography variant="subtitle1" gutterBottom color="black" fontWeight="bold">
                    Cantidad:
                  </Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography variant="subtitle1" gutterBottom color="black" fontWeight="bold">
                    Subtotal:
                  </Typography>
                </Grid>
              </Grid>
              {data.detalle_factura.map((detalle, index) => (
                <Grid container spacing={1} key={index}>
                  <Grid item md={2}>
                    <Typography variant="subtitle1" gutterBottom color="black">
                      {detalle.producto_id ? "Producto" : "Servicio"}
                    </Typography>
                  </Grid>
                  <Grid item md={3}>
                    <Typography variant="subtitle1" gutterBottom color="black">
                      {detalle.producto ? detalle.producto.nombre : 'Servicio'}
                    </Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Typography variant="subtitle1" gutterBottom color="black">
                      {detalle.precio}
                    </Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Typography variant="subtitle1" gutterBottom color="black">
                      {detalle.cantidad}
                    </Typography>
                  </Grid>
                  <Grid item md={3}>
                    <Typography variant="subtitle1" gutterBottom color="black">
                      {detalle.subtotal}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
              <Grid container spacing={1} style={{ marginTop: "20px" }}>
                <Grid item md={6}>
                  <Typography variant="subtitle1" gutterBottom color="black" fontWeight="bold">
                    Subtotal:
                  </Typography>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="subtitle1" gutterBottom color="black">
                    {data.subtotaltotal}
                  </Typography>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="subtitle1" gutterBottom color="black" fontWeight="bold">
                    Impuesto:
                  </Typography>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="subtitle1" gutterBottom color="black">
                    {data.impuesto}
                  </Typography>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="subtitle1" gutterBottom color="black" fontWeight="bold">
                    Total:
                  </Typography>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="subtitle1" gutterBottom color="black">
                    {data.total}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </div>
          <button onClick={handleSendPdf}>Enviar PDF por correo</button>
          <PDFDownloadLink document={<MyDocument data={data} />} fileName={`factura-${data.id}.pdf`}>
            {({ loading }) => (loading ? 'Cargando documento...' : 'Descargar PDF')}
          </PDFDownloadLink>
        </div>
      )}
    </Grid>
  );
};

export default DetalleOrden;








