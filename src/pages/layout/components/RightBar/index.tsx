import { Box, Tab, Tabs, Paper, useTheme, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import type { RightBarMenuItemType } from '../../../../store/navegacao/types/RightBarMenuItemType';
import useNavegacaoStore from '../../../../store/navegacao/useNavegacaoStore';

const RightBar = () => {
  const theme = useTheme();
  const { menu } = useNavegacaoStore();
  const { rightBarMenuItems } = menu;
  const [activeTabIndex, setActiveTabIndex] = useState<number | false>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (rightBarMenuItems && rightBarMenuItems[newValue]) {
      rightBarMenuItems[newValue].actionOnClick();
    }
  };

  useEffect(() => {
    if (rightBarMenuItems) {
      const selectedIndex = rightBarMenuItems.findIndex(
        (item) => item.isSelected
      );
      setActiveTabIndex(selectedIndex !== -1 ? selectedIndex : false);
    } else {
      setActiveTabIndex(false);
    }
  }, [rightBarMenuItems]);

  if (!rightBarMenuItems || rightBarMenuItems.length === 0) {
    // Pode retornar null ou um placeholder estilizado se a barra estiver vazia
    return (
      <Box
        sx={{
          width: 240,
          p: 2,
          display: { xs: 'none', md: 'block' },
          backgroundColor: theme.palette.background.paper,
        }}>
        <Typography
          variant='caption'
          sx={{ color: theme.palette.text.secondary }}>
          Nenhuma opção disponível.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      square
      sx={{
        width: 240, // Largura fixa para a RightBar
        height: '100%', // Ocupa toda a altura disponível
        backgroundColor: theme.palette.background.paper,
        borderLeft: `1px solid ${theme.palette.divider}`,
        display: { xs: 'none', md: 'block' }, // Esconder em telas pequenas, mostrar em médias e grandes
      }}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
        }}>
        <Tabs
          value={activeTabIndex}
          onChange={handleChange}
          aria-label='abas de navegação da barra lateral direita'
          orientation='vertical'
          variant='scrollable' // Permite rolagem se houver muitos itens
          scrollButtons='auto'
          textColor='inherit'
          indicatorColor='primary' // Usará a cor primária do tema para o indicador
          sx={{
            height: '100%',
            '& .MuiTab-root': {
              minHeight: 48, // Altura mínima para cada Tab
              justifyContent: 'flex-start', // Alinha texto à esquerda
              textAlign: 'left',
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
              color: theme.palette.text.secondary,
              textTransform: 'none', // Mantém a capitalização original do label
              '&.Mui-selected': {
                color: theme.palette.accentCyan.main, // Cor de destaque para item selecionado
                backgroundColor: theme.palette.action.selected,
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.accentCyan.main, // Cor do indicador
              left: 0, // Posiciona o indicador na borda esquerda
            },
          }}>
          {rightBarMenuItems.map((item: RightBarMenuItemType) => (
            <Tab
              key={item.id}
              // icon={item.icon || undefined} // Adicionar ícone se disponível no tipo
              // iconPosition="start"
              label={item.label}
              aria-label={item.label}
              sx={{
                justifyContent: 'flex-start', // Garante que o conteúdo do Tab (ícone + label) comece da esquerda
              }}
            />
          ))}
        </Tabs>
      </Box>
    </Paper>
  );
};

export default RightBar;
