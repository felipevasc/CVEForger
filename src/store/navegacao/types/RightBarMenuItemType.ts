import { ReactNode } from 'react';

export interface RightBarMenuItemType {
  id: string;
  icon?: ReactNode; // MUI icon or other React component
  label: string;
  actionOnClick: () => void;
  isSelected?: boolean; // Optional: to indicate if the item is currently active/selected
}
