import {
  Home as HomeIcon,
  Search as SearchIcon,
  SettingsApplications as SettingsApplicationsIcon,
  HelpOutline as HelpOutlineIcon,
  ExitToApp as ExitToAppIcon,
  Security as SecurityIcon,
  Description as DescriptionIcon,
  Typography // Import Typography
} from "@mui/icons-material";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
// Corrected import path for useNavegacaoStore
import useNavegacaoStore from "../../../../store/navegacao/useNavegacaoStore";

const LeftBar = () => {
  const theme = useTheme();
  const { menu } = useNavegacaoStore();

  const primaryMenuItems = [
    { text: 'Início', icon: <HomeIcon />, action: () => console.log("Navegar para Início") },
    { text: 'Buscar CVEs', icon: <SearchIcon />, action: () => console.log("Navegar para Buscar CVEs") },
    { text: 'Realizar PoC', icon: <SecurityIcon />, action: () => console.log("Navegar para Realizar PoC") },
    { text: 'Gerar Relatório', icon: <DescriptionIcon />, action: () => console.log("Navegar para Gerar Relatório") },
  ];

  const secondaryMenuItems = [
    { text: 'Configurações', icon: <SettingsApplicationsIcon />, action: () => console.log("Navegar para Configurações") },
    { text: 'Ajuda', icon: <HelpOutlineIcon />, action: () => console.log("Navegar para Ajuda") },
    { text: 'Sair', icon: <ExitToAppIcon />, action: () => console.log("Sair do sistema") },
  ];

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
      }}
      role="presentation"
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: theme.palette.accentGreen.main, fontWeight: 'bold' }}>
          Menu Principal
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {primaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                item.action();
                menu.menuEsquerdo.close();
              }}
              sx={{
                '&:hover': { backgroundColor: theme.palette.action.hover },
                pl: 2.5,
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.accentCyan.main, minWidth: 'auto', mr: 1.5 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ style: { fontWeight: 500 } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ backgroundColor: theme.palette.divider, my: 0 }} />
      <List>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                item.action();
                menu.menuEsquerdo.close();
              }}
              sx={{
                '&:hover': { backgroundColor: theme.palette.action.hover },
                pl: 2.5,
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.accentGreen.main, minWidth: 'auto', mr: 1.5 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ style: { fontWeight: 500 } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      open={menu.menuEsquerdo.get}
      onClose={() => menu.menuEsquerdo.close()}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        }
      }}
    >
      {DrawerList}
    </Drawer>
  );
}

export default LeftBar;
