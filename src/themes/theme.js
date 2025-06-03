import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2", // Color primario principal
      light: "#63a4ff", // Color primario claro
      dark: "#004ba0", // Color primario oscuro
      contrastText: "#ffffff", // Texto en contraste con el color primario
    },
    secondary: {
      main: "#0288d1", // Color secundario principal
      light: "#5eb8ff", // Color secundario claro
      dark: "#005b9f", // Color secundario oscuro
      contrastText: "#ffffff", // Texto en contraste con el color secundario
    },
    background: {
      default: "#121212", // Color de fondo predeterminado
      paper: "#1e1e1e", // Color de fondo de los componentes
    },
    text: {
      primary: "#ffffff", // Color de texto primario
      secondary: "#b0bec5", // Color de texto secundario
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1976d2", // Fondo de la barra de herramientas en color azul
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          "&.MuiTypography-colorSecondary": {
            color: 'black', // Cambiar el color de las letras secundarias a negro
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: '#FFF', // Cambiar el color de las letras secundarias a blanco
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#FFF !important', // Cambiar el color del borde a blanco
        }
      },
    }
  },
});
