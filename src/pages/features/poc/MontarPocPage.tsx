import React from 'react';
import { Typography, Container } from '@mui/material';

const MontarPocPage: React.FC = () => (
  <Container>
    <Typography variant="h4" component="h1" gutterBottom>
      Montar PoC Page
    </Typography>
    <Typography variant="body1">
      Conteúdo da página Montar PoC.
    </Typography>
  </Container>
);

export default MontarPocPage;
