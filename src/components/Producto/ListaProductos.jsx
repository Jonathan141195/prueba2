import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Done, Info } from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";

import ProductoService from "../../services/ProductoService";
import BotonExcel from "../Excel/BotonExcel";

export function ListaProductos() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    ProductoService.getProductos()
      .then((response) => {
        console.log(response);
        setData(response.data.results);
        setError(response.error);
        setLoaded(true);
        setProductos(response.data.results); // Asignar los productos obtenidos
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoaded(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Grid container sx={{ p: 12 }} spacing={3}>
      {data?.map((item) => (
        <Grid item xs={4} key={item.id}>
          <Card>
            <CardHeader
              sx={{
                p: 0,
                backgroundColor: "blue",
                color: "black",
                fontWeight: "bold",
              }}
              style={{ textAlign: "center", color: "black" }}
              title={item.title}
              subheader={
                <span style={{ color: "white", fontWeight: "bold" }}>
                  {item.nombre}
                </span>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <span style={{ marginRight: 20 }}>
                  <Done />
                </span>
                Nombre: {item.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <span style={{ marginRight: 20 }}>
                  <Done />
                </span>
                Descripción: {item.descripcion}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <span style={{ marginRight: 20 }}>
                  <Done />
                </span>
                Marca: {item.marca}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <span style={{ marginRight: 20 }}>
                  <Done />
                </span>
                Costo: ₡ {item.precio}
              </Typography>
            </CardContent>
            <CardActions
              disableSpacing
              sx={{
                backgroundColor: (theme) => theme.palette.action.focus,
                color: (theme) => theme.palette.common.white,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Detalle
              </Typography>
              <IconButton
                component={Link}
                to={`/producto/${item.id}`}
                aria-label="Detalle"
                sx={{ ml: "auto" }}
              >
                <Info />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12} sx={{ textAlign: "center", mt: 3 }}>
        <BotonExcel
          productos={productos}
          variant="contained"
          color="primary"
          sx={{ fontSize: "1.2rem" }}
        >
          Exportar Excel
        </BotonExcel>
      </Grid>
    </Grid>
  );
}

