import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, List, ListItemButton, ListItemText } from "@mui/material";
import ProveedorService from "../../services/ProveedorService";

export function DetalleProveedor() {
  const routeParams = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ProveedorService.getProveedorId(routeParams.id)
      .then((response) => {
        setData(response.data.results);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        setError(error);
        throw new Error("Respuesta no válida del servidor");
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container component="main" sx={{ mt: 12, mb: 2, maxWidth: "lg", textAlign: "center" }}>

      {data && (
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={7} sx={{ textAlign: "center" }}>
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <Box fontWeight="bold" color="black" component="h2">
                Proveedor:
              </Box>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                color="black"
              >
                {data.nombre}
              </Typography>
              <Typography
                variant="subtitle1"
                component="h1"
                gutterBottom
                color="black"
              >
                Teléfono: {data.telefono}
              </Typography>
              <Typography
                variant="subtitle1"
                component="h1"
                gutterBottom
                color="black"
              >
                Correo Electrónico: {data.correo}
              </Typography>
              <Typography
                component="span"
                variant="subtitle1"
                display="block"
                color="black"
              >
                Dirección: {data.direccion}
              </Typography>
              <Typography
                component="span"
                variant="subtitle1"
                textAlign="center"
                display="block"
              >
                <Box fontWeight="bold" color="black">
                  Contactos:
                </Box>
                {data.contactos && data.contactos.length > 0 ? (
                  <List sx={{ width: "100%", maxWidth: 600, margin: "auto", textAlign: "center" }}>
                    {data.contactos.map((item) => (
                      <ListItemButton
                        key={item.id}
                        sx={{ backgroundColor: "transparent" }}
                      >
                        <Typography color="black" textAlign="center">
                          <ListItemText
                            primary={`Nombre: ${item.nombre} - Teléfono: ${item.telefono} - Correo electrónico: ${item.correo} `}
                          />
                        </Typography>
                        
                      </ListItemButton>
                    ))}
                  </List>
                ) : (
                  <Typography color="black" textAlign="center">
                    No hay contactos disponibles.
                  </Typography>
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

