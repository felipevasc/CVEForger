import { useState } from 'react'; 
import { Box, CssBaseline, ThemeProvider, GlobalStyles, useTheme, useMediaQuery } from '@mui/material';
// Adjusted path for techTheme
import { techTheme } from '../../theme/techTheme'; 

// Adjusted paths for components
import Header from './components/Header'; 
import LeftBar from './components/LeftBar'; 
import Content from './components/Content'; 
import RightBar from './components/RightBar'; 
import BottomBar from './components/BottomBar';

const GlobalAppStyles = () => {
  const theme = useTheme();
  return (
    <GlobalStyles styles={{
      'html, body, #root': {
        margin: 0,
        padding: 0,
        height: '100%',
        width: '100%',
        overflow: 'hidden', 
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
      '*::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '*::-webkit-scrollbar-track': {
        background: theme.palette.background.paper,
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.secondary.main,
        borderRadius: '4px',
      },
      '*::-webkit-scrollbar-thumb:hover': {
        backgroundColor: theme.palette.secondary.dark,
      },
    }} />
  );
}

const MainLayout = () => {
  // LeftBar's open/close state is managed by useNavegacaoStore internally.
  // Header is responsible for calling the store action to open LeftBar.
  // LeftBar itself uses the store to manage its 'open' prop and 'onClose' handler.
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header /> 
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' /* Container for LeftBar, Content, RightBar */ }}>
        <LeftBar /> 
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: 'auto', 
            overflowX: 'hidden',
            p: { xs: 1, sm: 2, md: 3 }, // Responsive padding
          }}
        >
          <Content />
        </Box>
        <RightBar /> {/* RightBar is styled to hide on xs screens */}
      </Box>
      <BottomBar />
    </Box>
  );
};

const AppLayout = () => {
  return (
    <ThemeProvider theme={techTheme}>
      <CssBaseline /> 
      <GlobalAppStyles />
      <MainLayout />
    </ThemeProvider>
  );
};

export default AppLayout;
