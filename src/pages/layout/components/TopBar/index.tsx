import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

const TopBar = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', width: '100%', boxShadow: 'none' }}>
      <AppBar position='static' color='warning' style={{ boxShadow: 'none' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='secondary'
          textColor='inherit'
          variant='fullWidth'
          aria-label='full width tabs example'>
          <Tab label='Realizar POC' />
          <Tab label='Buscar CVE' />
          <Tab label='Implementar CVE' />
          <Tab label='Montar POC' />
        </Tabs>
      </AppBar>
    </Box>
  );
};

export default TopBar;
