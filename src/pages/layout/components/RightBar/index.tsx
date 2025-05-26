import { Box, Button, Paper, useTheme, Typography } from '@mui/material'; // Changed Tab, Tabs to Button
// Removed useState, useEffect as they are not needed for buttons in this context
import type { RightBarMenuItemType } from '../../../../store/navegacao/types/RightBarMenuItemType';
import useNavegacaoStore from '../../../../store/navegacao/useNavegacaoStore';

const RightBar = () => {
  const theme = useTheme();
  const { menu } = useNavegacaoStore();
  const { rightBarMenuItems } = menu;

  // handleChange and related useEffect are removed as they are specific to Tabs.
  // The actionOnClick from RightBarMenuItemType will be used directly.

  if (!rightBarMenuItems || rightBarMenuItems.length === 0) {
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
        width: 240,
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        borderLeft: `1px solid ${theme.palette.divider}`,
        display: { xs: 'none', md: 'block' },
        p: 1, // Added padding for spacing around buttons
      }}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex', // Added for vertical button layout
          flexDirection: 'column', // Added for vertical button layout
          gap: 1, // Added for spacing between buttons
        }}>
        {rightBarMenuItems.map((item: RightBarMenuItemType) => (
          <Button
            key={item.id}
            variant={item.isSelected ? 'contained' : 'outlined'} // Toggle variant based on isSelected
            onClick={item.actionOnClick} // Use actionOnClick directly
            startIcon={item.icon || undefined} // Use icon if provided
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              textTransform: 'none',
              // Styling for selected state can be enhanced here if needed
              // For example, using theme colors:
              ...(item.isSelected && {
                backgroundColor: theme.palette.accentCyan.main,
                color: theme.palette.common.white, // Ensuring text is readable on accentCyan
                '&:hover': {
                  backgroundColor: theme.palette.accentCyan.dark, // Darken on hover for selected
                },
              }),
              // Default hover for non-selected outlined buttons is usually fine
            }}>
            {item.label}
          </Button>
        ))}
      </Box>
    </Paper>
  );
};

export default RightBar;
