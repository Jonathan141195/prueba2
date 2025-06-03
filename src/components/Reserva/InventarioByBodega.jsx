import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { Done, Info } from "@mui/icons-material";
import { useEffect, useState } from "react";

import BodegaService from "../../services/BodegaService";

export function InventarioByBodega() {
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState("");
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);

  //Llamar al API y obtener la lista de peliculas

  useEffect(() => {
    BodegaService.getBodegaByUsuario()
      .then((response) => {
        console.log(response);
        setData(response.data.results);
        setError(response.error);
        setLoaded(true);
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

  //map - ayudar a obtener cada registro
  //Son ejecutores ()=>{} -> este ocupa return, ()=>()
  return (
    <Grid container sx={{ p: 12 }} spacing={3}>
      {/* data verifica si hay datos para pasarlos a mapear */}
      {data?.map(
        (
          item /*item es una variable q se define y va a obtener cada dato de data */
        ) => (
          <Grid item xs={4} key={item.id}>
            {" "}
            {/*Item.id - intercolacion */}
            <Card>
              <CardHeader
                sx={{
                  p: 0,
                  backgroundColor: "orange",
                  color: "black",
                  fontWeight: "bold", // Establecer el texto en negrita
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
                  Capacidad de productos: {item.capacidad}
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
                 <Typography variant="body2" color="text.secondary"  >
                  Detalle
                </Typography>
                <IconButton
                  component={Link}
                  to={`/inventario/bodega/${item.id}`}
                  aria-label="Detalle"
                  sx={{ ml: "auto" }}
                >
                  <Info />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        )
      )}
    </Grid>
  );
}