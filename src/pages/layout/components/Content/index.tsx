import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const Content = () => {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        p: 1 // Basic padding, adjust as needed
      }}
    >
      <Outlet /> {/* This will render the matched route's component */}
    </Box>
  );
};

export default Content;
