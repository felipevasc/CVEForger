import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import AddTaskIcon from '@mui/icons-material/AddTask';

interface PainelResumoProps {
  fonte?: string;
  totalExternal?: number;
  knownCount: number;
  unknownCount: number;
}

export const PainelResumo: React.FC<PainelResumoProps> = ({
  fonte,
  totalExternal,
  knownCount,
  unknownCount,
}) => (
  <Grid container spacing={3} sx={{ mb: 3 }}>
    {fonte && (
      <Grid>
        <Paper
          elevation={2}
          sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <ScienceIcon color='primary' sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant='subtitle1' color='textSecondary'>
              Fonte Externa de CVEs:
            </Typography>
            <Typography variant='h6'>{fonte}</Typography>
            <Typography>
              Total listadas: {totalExternal?.toLocaleString('pt-BR')}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    )}
    <Grid>
      <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <AddTaskIcon color='primary' sx={{ fontSize: 40, mr: 2 }} />
        <Box>
          <Typography variant='subtitle1' color='textSecondary'>
            CVEs em sua Base:
          </Typography>
          <Typography variant='h6'>
            {knownCount.toLocaleString('pt-BR')}
          </Typography>
          <Typography>
            Descobertas não registradas: {unknownCount.toLocaleString('pt-BR')}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  </Grid>
);
