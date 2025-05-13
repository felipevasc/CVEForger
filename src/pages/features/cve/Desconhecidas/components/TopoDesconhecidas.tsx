import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { techTheme } from '../../../../../theme/techTheme';
export const TopoDesconhecidas: React.FC = () => (
  <AppBar
    position='static'
    elevation={0}
    sx={{ borderBottom: `1px solid ${techTheme.palette.divider}` }}>
    <Toolbar>
      <IconButton
        edge='start'
        sx={{ mr: 2, color: techTheme.palette.primary.main }}>
        <SecurityIcon fontSize='large' />
      </IconButton>
      <Typography variant='h5' sx={{ flexGrow: 1, fontWeight: 'bold' }}>
        Análise de CVEs Desconhecidas
      </Typography>
    </Toolbar>
  </AppBar>
);
