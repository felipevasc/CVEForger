import Desconhecidas from '../../../features/cve/Desconhecidas/index';
import { Box } from '@mui/material';

const Content = () => {
  return (
    // Replace div with MUI Box for theme integration and sx prop usage
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%', // Ensure it tries to fill its container (from main layout)
        display: 'flex', 
        flexDirection: 'column',
        // overflow: 'auto', // Scrollability should be handled by the main layout's content area if needed
        // p: 1 // Basic padding, can be adjusted or removed if Desconhecidas handles its own
      }}
    >
      <Desconhecidas />
    </Box>
  );
};

export default Content;
