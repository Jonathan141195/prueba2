import { useState, useEffect } from "react";
import { Container, Grid, Typography, Toolbar } from "@mui/material";

export function Footer() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000); // Cambia este valor según el tiempo de retardo deseado
  }, []);

  return (
    <Toolbar
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: "0.5rem",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        opacity: loaded ? 1 : 0, // Aplicar opacidad 0 mientras se carga y 1 cuando está cargado
        transition: "opacity 1s ease", // Agregar una transición de opacidad
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}>
            <Typography color="black" variant="subtitle1">
              Derechos reservados
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="black" variant="body1">
              {`${new Date().getFullYear()}`}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Toolbar>
  );
}

