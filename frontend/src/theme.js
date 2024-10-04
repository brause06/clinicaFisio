import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00a1fd', // El azul de la clínica
      contrastText: '#ffffff', // Texto blanco para contrastar con el azul
    },
    secondary: {
      main: '#ffffff', // Blanco como color secundario
    },
    background: {
      default: '#f5f5f5', // Un gris muy claro para el fondo
      paper: '#ffffff', // Blanco para los elementos de papel
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
