import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#0d9488', // Teal
        light: '#14b8a6',
        dark: '#0f766e',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#0284c7', // Sky Blue / Deep Blue
        light: '#38bdf8',
        dark: '#0369a1',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'dark' ? '#0b131e' : '#f8fafc',
        paper: mode === 'dark' ? '#111c2d' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f1f5f9' : '#0f172a',
        secondary: mode === 'dark' ? '#94a3b8' : '#475569',
      },
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      h1: { fontFamily: "'Outfit', sans-serif", fontWeight: 800 },
      h2: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
      h3: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
      h4: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
      h5: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
      h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 20px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 16,
          },
        },
      },
    },
  });
