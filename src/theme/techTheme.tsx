import { createTheme } from '@mui/material';

// Definindo as cores base inspiradas no gov.br, mas com um toque tecnológico/hacker
const govBrDarkBlue = '#0D1B2A'; // Azul escuro, quase preto
const govBrDarkTeal = '#004D40'; // Verde-azulado escuro

// Cores de destaque vibrantes para o toque "hacker"
const hackerGreen = '#39FF14'; // Verde limão vibrante
const hackerCyan = '#00FFFF'; // Ciano vibrante

// Cores neutras para o modo escuro
const darkBackground = '#121212'; // Fundo principal muito escuro
const darkSurface = '#1E1E1E'; // Superfícies elevadas (cards, papers)
const textPrimaryDark = '#E0E0E0'; // Texto principal claro
const textSecondaryDark = '#A0A0A0'; // Texto secundário mais suave
const errorRed = '#FF1744'; // Vermelho para erros

export const techTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: govBrDarkBlue, // Cor primária principal
    },
    secondary: {
      main: govBrDarkTeal, // Cor secundária principal
    },
    background: {
      default: darkBackground,
      paper: darkSurface,
    },
    text: {
      primary: textPrimaryDark,
      secondary: textSecondaryDark,
    },
    // Adicionando cores de destaque diretamente na paleta para fácil acesso
    accentGreen: {
      main: hackerGreen,
      contrastText: darkBackground, // Texto escuro para contraste com verde vibrante
    },
    accentCyan: {
      main: hackerCyan,
      contrastText: darkBackground, // Texto escuro para contraste com ciano vibrante
    },
    error: {
      main: errorRed,
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", "Courier New", monospace', // Fonte monoespaçada para o feeling "hacker"
    h4: {
      fontWeight: 700,
      color: textPrimaryDark, // Ajustado para o tema escuro
    },
    h5: {
      fontWeight: 600,
      color: textPrimaryDark, // Ajustado para o tema escuro
    },
    body1: {
      color: textPrimaryDark,
    },
    body2: {
      color: textSecondaryDark,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: darkSurface, // AppBar com cor de superfície escura
          color: textPrimaryDark,
          boxShadow: '0 2px 4px -1px rgba(0,0,0,0.2)', // Sombra sutil para o modo escuro
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        // Exemplo de uso da cor de destaque para botões primários
        containedPrimary: {
          backgroundColor: hackerGreen,
          color: darkBackground,
          '&:hover': {
            backgroundColor: '#30DB12', // Um tom ligeiramente mais escuro do hackerGreen para hover
          },
        },
        containedSecondary: {
          backgroundColor: hackerCyan,
          color: darkBackground,
          '&:hover': {
            backgroundColor: '#00E5E5', // Um tom ligeiramente mais escuro do hackerCyan para hover
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: govBrDarkBlue, // Cabeçalho da tabela com o azul escuro
          '& .MuiTableCell-root': {
            fontWeight: 'bold',
            color: textPrimaryDark, // Texto claro para o cabeçalho
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: darkSurface, // Cor de papel/superfície escura
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: hackerCyan, // Links com a cor ciano "hacker"
          textDecorationColor: hackerCyan,
          '&:hover': {
            textDecorationColor: hackerGreen,
            color: hackerGreen,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& $notchedOutline': {
            borderColor: textSecondaryDark,
          },
          '&:hover $notchedOutline': {
            borderColor: hackerCyan,
          },
          '&$focused $notchedOutline': {
            borderColor: hackerGreen,
          },
          color: textPrimaryDark,
        },
        notchedOutline: {
          borderColor: textSecondaryDark,
        }
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: textSecondaryDark,
          '&$focused': {
            color: hackerGreen,
          },
        },
      },
    },
  },
});
