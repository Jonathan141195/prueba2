import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ProductoService from "../../services/ProductoService";

export function Inventario() {
  const routeParams = useParams();

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ProductoService.getProductoByBodega(routeParams.id)
      .then((response) => {
        console.log(response.data.results);
        setData(response.data.results);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        throw new Error("Respuesta no válida del servidor");
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(data);

  // Obtener el nombre de la bodega, asumiendo que es el mismo para todos los productos
  const nombreBodega = data.length > 0 ? data[0].nombreBodega : "";

  return (
    <Container component="main" sx={{ mt: 10, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{ fontSize: "2.5rem" }}
        >
          Inventario: {nombreBodega}
        </Typography>
      </Box>
      {data && (
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={12}>
            <TableContainer component={Paper}>
              <Table aria-label="Datos del Producto">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Nombre
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Código Producto
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Descripción
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Total Disponible
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Cantidad Máxima
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Cantidad Mínima
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Usuario registra
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Usuario actualiza
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell component="th" scope="row">
                        {producto.nombre}
                      </TableCell>
                      <TableCell align="center">{producto.sku}</TableCell>
                      <TableCell align="center">
                        {producto.descripcion}
                      </TableCell>
                      <TableCell align="center">
                        {producto.totalDisponible}
                      </TableCell>
                      <TableCell align="center">
                        {producto.cantidadMaxima}
                      </TableCell>
                      <TableCell align="center">
                        {producto.cantidadMinima}
                      </TableCell>
                      <TableCell align="center">
                        {producto.nombreUsuarioRegistra}
                      </TableCell>
                      <TableCell align="center">
                        {producto.nombreUsuarioActualiza}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
