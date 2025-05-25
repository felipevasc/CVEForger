import { createTheme } from '@mui/material';

export const techTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#007bff' },
    secondary: { main: '#6c757d' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
    text: { primary: '#212529', secondary: '#495057' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, color: '#343a40' },
    h5: { fontWeight: 600, color: '#343a40' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#343a40',
          boxShadow: '0 2px 4px -1px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#e9ecef',
          '& .MuiTableCell-root': { fontWeight: 'bold', color: '#495057' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
  },
});
