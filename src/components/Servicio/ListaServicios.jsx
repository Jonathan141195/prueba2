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
import ServicioService from "../../services/ServicioService";

export function ListaServicios() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ServicioService.getServicio()
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

  return (
    <Grid container sx={{ p: 10 }} spacing={4}>
      {data?.map((item) => (
        <Grid item xs={12} sm={12} md={4} lg={3} key={item.id}>
          <Card>
            <CardHeader
              sx={{
                p: 0,
                backgroundColor: "blue",
                color: "black",
                fontWeight: "bold",
              }}
              style={{ textAlign: "center", color: "black" }}
              title={
                <Typography variant="h6" style={{ color: "black" }}>
                  {item.nombre}
                </Typography>
              }
              subheader={
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {item.descripcion}
                </span>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <span style={{ marginRight: 20 }}>
                  <Done />
                </span>
                Tarifa: ₡{item.tarifa}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <span style={{ marginRight: 20 }}>
                  <Done />
                </span>
                Tiempo de Servicio: {item.tiempo_servicio} horas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <span style={{ marginRight: 20 }}>
                  <Done />
                </span>
                Tipo de Vehículo: {item.tipo_vehiculo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <span style={{ marginRight: 20 }}>
                  <Done />
                </span>
                Nivel de Dificultad: {item.nivel_dificultad}
              </Typography>
            </CardContent>
            <CardActions
              disableSpacing
              sx={{
                backgroundColor: (theme) => theme.palette.action.focus,
                color: (theme) => theme.palette.common.white,
              }}
            >
              <IconButton
                component={Link}
                to={`/Servicio/${item.id}`}
                aria-label="Detalle"
                sx={{ ml: "auto" }}
              >
                <Info />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}


