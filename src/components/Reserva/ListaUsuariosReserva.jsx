import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { Info } from "@mui/icons-material"; // Importar el ícono de información
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import UsuarioService from '../../services/UsuarioService';

const ListaUsuariosReserva = () => {
  const [usuarios, setUsuarios] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    UsuarioService.getUsers()
      .then((response) => {
        console.log(response);
        setUsuarios(response.data.results);
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError(error);
        setLoaded(false);
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Grid container sx={{ p: 10 }} spacing={4}>
      {usuarios?.map((usuario) => (
        <Grid item xs={12} sm={12} md={4} lg={3} key={usuario.id}>
          <Card>
            <CardHeader
              sx={{
                p: 2,
                backgroundColor: "#f5f5f5",
                textAlign: "center"
              }}
              title={
                <Typography variant="h6" style={{ color: "black" }}>
                  {usuario.nombre}
                </Typography>
              }
              subheader={
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {usuario.correo_electronico}
                </span>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Teléfono: {usuario.telefono}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dirección: {usuario.direccion}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha de Nacimiento: {usuario.fecha_nacimiento}
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
                to={`/ReservabyUsuario/${usuario.id}`}
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
};

ListaUsuariosReserva.propTypes = {
  onUserSelected: PropTypes.func,
};

export default ListaUsuariosReserva;
