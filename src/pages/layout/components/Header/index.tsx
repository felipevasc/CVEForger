import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import useNavegacaoStore from '../../../../store/navegacao/useNavegacaoStore';
import { MenuOpenTwoTone } from '@mui/icons-material';
import ConfigMenu from './ConfigMenu';
import logo from '../../../../assets/cveforger.png';

const Header = () => {
  const { menu } = useNavegacaoStore();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' color='transparent'>
        <Toolbar style={{ alignItems: 'flex-start', paddingTop: 4 }}>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
            onClick={() => menu.menuEsquerdo.open()}>
            <MenuOpenTwoTone color='warning' />
          </IconButton>
          <Toolbar style={{ width: '100%', display: 'flex' }}>
            <img
              src={logo}
              alt='Logo'
              style={{ width: 120, height: 100, marginRight: 16 }}
            />
            <Typography
              variant='h3'
              component='div'
              sx={{ flexGrow: 1 }}
              align='justify'
              color='warning.dark'>
              CVE Forger
            </Typography>
          </Toolbar>
          <ConfigMenu />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
