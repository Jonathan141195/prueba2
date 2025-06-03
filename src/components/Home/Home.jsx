import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import fondo from "../../assets/fondo.jpg";

export function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container
      sx={{
        p: 2,
        maxWidth: "sm",
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        textAlign: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Box
        sx={{
          maxWidth: "80%",
          margin: "auto",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "opacity 1s ease",
          opacity: showWelcome ? 1 : 0,
        }}
      >
        <Typography variant="h3" sx={{ margin: "0 auto", fontWeight: "bold", color: "black" }}>
          Bienvenido a Mecanica Rapida Taller Alvarez
        </Typography>
      </Box>
    </Container>
  );
}
