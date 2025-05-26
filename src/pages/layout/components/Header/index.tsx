import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { MenuOpenTwoTone } from '@mui/icons-material';
import { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate, useLocation } from 'react-router-dom'; // Added
import useNavegacaoStore from '../../../../store/navegacao/useNavegacaoStore';
import ConfigMenu from './ConfigMenu';
import logo from '../../../../assets/cveforger.png';

const navigationTabs = [
  { label: 'Realizar PoC', path: '/realizar-poc' },
  { label: 'Buscar CVE', path: '/buscar-cve' },
  { label: 'Implementar CVE', path: '/implementar-cve' },
  { label: 'Montar PoC', path: '/montar-poc' },
];

// Helper to map path to tab index
const pathToTabIndex = (path: string): number => {
  const index = navigationTabs.findIndex(tab => tab.path === path);
  return index === -1 ? 0 : index; // Default to 0 or a specific default tab index
};


const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { menu } = useNavegacaoStore();
  const navigate = useNavigate(); // Added
  const location = useLocation(); // Added

  // Set currentTab based on location.pathname
  const [currentTab, setCurrentTab] = useState(pathToTabIndex(location.pathname));

  // Effect to update tab when location changes (e.g., browser back/forward)
  useEffect(() => {
    setCurrentTab(pathToTabIndex(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    if (navigationTabs[newValue]) {
      navigate(navigationTabs[newValue].path);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position='static'
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: `0 2px 4px -1px ${theme.palette.primary.dark}`,
        }}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            px: { xs: 1, sm: 2 },
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              aria-label='abrir menu lateral'
              sx={{ mr: 1 }}
              onClick={() => menu.menuEsquerdo.open()}>
              <MenuOpenTwoTone sx={{ color: theme.palette.accentGreen.main }} />
            </IconButton>
            <img
              src={logo}
              alt='Logo CVE Forger'
              style={{
                width: isMobile ? 60 : 60,
                height: 'auto',
                maxHeight: isMobile ? 35 : 50,
                marginRight: theme.spacing(isMobile ? 1 : 2),
              }}
            />
            {!isMobile && (
              <Typography
                variant='h5'
                component='div'
                sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                CVE Forger
              </Typography>
            )}
          </Box>

          {!isMobile && (
            <Box
              sx={{
                alignSelf: 'flex-end',
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
              }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant='scrollable'
                scrollButtons='auto'
                aria-label='abas de navegação principais'
                sx={{
                  '& .MuiTab-root': {
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    minWidth: 120,
                    '&.Mui-selected': {
                      color: theme.palette.accentGreen.main,
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.accentGreen.main,
                  },
                }}>
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
            variant='scrollable'
            scrollButtons='auto'
            aria-label='abas de navegação principais mobile'
            sx={{
              width: '100%',
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              '& .MuiTab-root': {
                color: theme.palette.text.secondary,
                fontSize: '0.8rem',
                minWidth: 'auto',
                flexGrow: 1,
                '&.Mui-selected': {
                  color: theme.palette.accentGreen.main,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.accentGreen.main,
              },
            }}>
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
