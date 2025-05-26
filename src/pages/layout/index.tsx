import { Box, CssBaseline, ThemeProvider, GlobalStyles, useTheme } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { techTheme } from '../../theme/techTheme'; 

import Header from './components/Header'; 
import LeftBar from './components/LeftBar'; 
import Content from './components/Content'; // Will render <Outlet />
import RightBar from './components/RightBar'; 
import BottomBar from './components/BottomBar';

// Page Components
import Desconhecidas from '../features/cve/Desconhecidas';
import RealizarPocPage from '../features/poc/RealizarPocPage';
import MontarPocPage from '../features/poc/MontarPocPage';
// import BuscarCvePagePlaceholder from '../features/cve/BuscarCvePagePlaceholder'; // Replaced
import SearchCvePage from '../features/cve/SearchCvePage'; // New Page

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
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header /> 
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <LeftBar /> 
        {/* Content Box now contains the Routes */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // overflowY: 'auto', // Let Content component handle its own scroll if needed via Outlet
            // overflowX: 'hidden',
            // p: { xs: 1, sm: 2, md: 3 }, // Padding moved to Content component for Outlet
            display: 'flex', // Added to make Content (and Outlet) fill the space
            flexDirection: 'column' // Added
          }}
        >
          <Routes>
            <Route path="/" element={<Content />}> {/* Content has Outlet */}
              <Route index element={<Navigate to="/implementar-cve" replace />} />
              <Route path="realizar-poc" element={<RealizarPocPage />} />
              <Route path="buscar-cve" element={<SearchCvePage />} /> {/* Updated Route */}
              <Route path="implementar-cve" element={<Desconhecidas />} />
              <Route path="montar-poc" element={<MontarPocPage />} />
              {/* Add other nested routes here if needed */}
            </Route>
          </Routes>
        </Box>
        <RightBar />
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
