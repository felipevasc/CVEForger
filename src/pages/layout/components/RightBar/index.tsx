import { Box, Tab, Tabs } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavegacaoStore } from '../../../../store/navegacao/useNavegacaoStore';
import type { RightBarMenuItemType } from '../../../../store/navegacao/types/RightBarMenuItemType';

const RightBar = () => {
  const { menu } = useNavegacaoStore();
  const { rightBarMenuItems } = menu;
  const [activeTabIndex, setActiveTabIndex] = useState<number | false>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // Call the item's action
    if (rightBarMenuItems && rightBarMenuItems[newValue]) {
      rightBarMenuItems[newValue].actionOnClick();
    }
    // Note: We are not setting activeTabIndex here based on click if isSelected is driving the tab state.
    // If the actionOnClick is supposed to toggle selection and update the list,
    // the useEffect below will handle setting the correct active tab.
    // If not, and the tab should always change on click, then:
    // setActiveTabIndex(newValue);
  };

  // Update activeTabIndex if isSelected changes from an external source or after actionOnClick
  useEffect(() => {
    if (rightBarMenuItems) {
      const selectedIndex = rightBarMenuItems.findIndex(item => item.isSelected);
      setActiveTabIndex(selectedIndex !== -1 ? selectedIndex : false);
    } else {
      setActiveTabIndex(false);
    }
  }, [rightBarMenuItems]);

  if (!rightBarMenuItems || rightBarMenuItems.length === 0) {
    return <div className='right'></div>; // Render an empty div or a placeholder
  }

  return (
    <div className='right'>
      <Box
        sx={{ bgcolor: 'background.primary', width: '100%', boxShadow: 'none' }}>
        <Tabs
          value={activeTabIndex}
          onChange={handleChange}
          aria-label='right bar dynamic tabs'
          orientation='vertical'
          variant='fullWidth' // This makes each tab take full width, icons and labels will be spaced out
          textColor='inherit'
          indicatorColor='primary'>
          {rightBarMenuItems.map((item: RightBarMenuItemType) => ( // Added type for item
            <Tab 
              key={item.id} 
              icon={item.icon} 
              label={item.label} 
              aria-label={item.label}
              // To prevent click from directly changing tab if isSelected is the source of truth
              // and actionOnClick updates isSelected, which then triggers useEffect.
              // However, standard Tabs behavior is to change on click.
              // If actionOnClick itself handles the "selection" logic and updates
              // the list that feeds isSelected, then this explicit onClick here might be redundant
              // or could conflict if not managed carefully with handleChange.
              // For now, let's rely on handleChange to call actionOnClick.
            />
          ))}
        </Tabs>
      </Box>
    </div>
  );
};

export default RightBar;
