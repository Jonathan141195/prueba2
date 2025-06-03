import { useEffect, useState } from "react";
import { Grid, Typography, Card, CardHeader, CardContent, CardActions } from "@mui/material";
import { Done } from "@mui/icons-material";
import UsuarioService from "../../services/UsuarioService";

export function ListaUsuarios() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    UsuarioService.getUsers()
      .then((response) => {
        setData(response.data.results);
        setLoaded(true);
      })
      .catch((error) => {
        setError(error.message);
        setLoaded(false);
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

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
                textAlign: "center",
              }}
              
              subheader={
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {item.nombre}
                </span>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <Done style={{ marginRight: 8 }} />
                Nombre: {item.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Done style={{ marginRight: 8 }} />
                Dirección: {item.direccion}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Done style={{ marginRight: 8 }} />
                Correo Electrónico: {item.correo_electronico}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Done style={{ marginRight: 8 }} />
                Fecha de Nacimiento: {item.fecha_nacimiento}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Done style={{ marginRight: 8 }} />
                Rol: {item.rol.nombre}
              </Typography>
            </CardContent>
            <CardActions
              disableSpacing
              sx={{
                backgroundColor: (theme) => theme.palette.action.focus,
                color: (theme) => theme.palette.common.white,
              }}
            >
              {/* Aquí puedes agregar botones o acciones adicionales */}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
