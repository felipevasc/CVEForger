import {
  Favorite,
  PersonPin,
  PhonelinkLockOutlined,
} from '@mui/icons-material';
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

const RightBar = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className='right'>
      <Box
        sx={{ bgcolor: 'background.primary', width: '100%', boxShadow: 'none' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='icon tabs example'
          orientation='vertical'
          variant='fullWidth'
          textColor='inherit'
          indicatorColor='primary'>
          <Tab icon={<PhonelinkLockOutlined color='warning' />} aria-label='phone' />
          <Tab icon={<Favorite color='warning' />} aria-label='favorite' />
          <Tab icon={<PersonPin color='warning' />} aria-label='person' />
        </Tabs>
      </Box>
    </div>
  );
};

export default RightBar;
