import { Box, Typography, useTheme, Link } from '@mui/material';

const BottomBar = () => {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        py: 1.5, 
        px: 2,
        backgroundColor: theme.palette.background.paper, 
        borderTop: `1px solid ${theme.palette.divider}`, 
        textAlign: 'center',
        color: theme.palette.text.secondary, 
        zIndex: theme.zIndex.drawer + 1, 
      }}
    >
      <Typography variant="caption" display="block">
        © {new Date().getFullYear()} CVE Forger - Todos os direitos reservados.
      </Typography>
      <Typography variant="caption">
        Desenvolvido com <Link href="https://mui.com/" target="_blank" rel="noopener noreferrer" sx={{color: theme.palette.accentCyan.main}}>Material-UI</Link> e paixão por segurança.
      </Typography>
    </Box>
  );
};

export default BottomBar;
