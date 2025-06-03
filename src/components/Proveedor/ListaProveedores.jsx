/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Done, Info } from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import ProveedorService from "../../services/ProveedorService";


export function ListaProveedores() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    ProveedorService.getProveedores()
      .then((response) => {
        console.log(response);
        setData(response.data.results);
        setError(response.error);
        setLoaded(true);
        setProveedores(response.data.results); // Asignar los productos obtenidos
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
                backgroundColor: "orange",
                color: "black",
                fontWeight: "bold",
              }}
              style={{ textAlign: "center", color: "black" }}
              title={item.title}
              subheader={
                <span style={{ color: "black", fontWeight: "bold" }}>
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
                Teléfono: {item.telefono}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <span style={{ marginRight: 20 }}>
                  <Done />
                </span>
                Correo electrónico: {item.correo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <span style={{ marginRight: 20 }}>
                  <Done />
                </span>
                Dirección: {item.direccion}
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
                to={`/proveedor/${item.id}`}
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
       
      </Grid>
    </Grid>
  );
}
