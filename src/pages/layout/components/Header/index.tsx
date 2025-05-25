import { AppBar, Box, IconButton, Toolbar, Typography, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import { MenuOpenTwoTone } from '@mui/icons-material';
import { useState } from 'react';
import useNavegacaoStore from '../../../../store/navegacao/useNavegacaoStore';
import ConfigMenu from './ConfigMenu';
import logo from '../../../../assets/cveforger.png';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { menu } = useNavegacaoStore();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    // Aqui você pode adicionar lógica para navegar para diferentes seções/páginas
    // com base na aba selecionada.
    // Ex: if (newValue === 0) router.push('/realizar-poc');
  };

  const navigationTabs = [
    { label: 'Realizar PoC' },
    { label: 'Buscar CVE' },
    { label: 'Implementar CVE' },
    { label: 'Montar PoC' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: theme.palette.background.paper, 
          color: theme.palette.text.primary,
          boxShadow: `0 2px 4px -1px ${theme.palette.primary.dark}` // Sombra sutil com cor do tema
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="abrir menu lateral"
              sx={{ mr: 1 }}
              onClick={() => menu.menuEsquerdo.open()}
            >
              <MenuOpenTwoTone sx={{ color: theme.palette.accentGreen.main }} />
            </IconButton>
            <img
              src={logo}
              alt="Logo CVE Forger"
              style={{ 
                width: isMobile ? 60 : 90,  // Tamanho do logo ajustado
                height: 'auto',
                maxHeight: isMobile ? 35 : 50, // Altura máxima do logo
                marginRight: theme.spacing(isMobile ? 1 : 2) 
              }}
            />
            {!isMobile && (
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                CVE Forger
              </Typography>
            )}
          </Box>

          {!isMobile && (
            <Box sx={{ alignSelf: 'flex-end', flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="abas de navegação principais"
                sx={{
                  '& .MuiTab-root': {
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    minWidth: 120, // Largura mínima para cada aba
                    '&.Mui-selected': {
                      color: theme.palette.accentGreen.main, // Cor da aba selecionada
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.accentGreen.main, // Cor do indicador
                  },
                }}
              >
                {navigationTabs.map((tab) => (
                  <Tab key={tab.label} label={tab.label} />
                ))}
              </Tabs>
            </Box>
          )}

          <ConfigMenu />
        </Toolbar>

        {isMobile && (
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable" // Permite rolagem em telas menores
            scrollButtons="auto" // Mostra botões de rolagem se necessário
            aria-label="abas de navegação principais mobile"
            sx={{
              width: '100%',
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              '& .MuiTab-root': {
                color: theme.palette.text.secondary,
                fontSize: '0.8rem', // Fonte menor para abas mobile
                minWidth: 'auto', // Permite que as abas sejam mais estreitas
                flexGrow: 1, // Distribui o espaço igualmente
                '&.Mui-selected': {
                  color: theme.palette.accentGreen.main,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.accentGreen.main,
              },
            }}
          >
            {navigationTabs.map((tab) => (
              <Tab key={tab.label} label={tab.label} />
            ))}
          </Tabs>
        )}
      </AppBar>
    </Box>
  );
};

export default Header;
