import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { techTheme } from '../../../../theme/techTheme'; // Adjust path as needed
import RightBar from './index';
import useNavegacaoStore from '../../../../store/navegacao/useNavegacaoStore';
import type { RightBarMenuItemType } from '../../../../store/navegacao/types/RightBarMenuItemType';

// Mock useNavegacaoStore
jest.mock('../../../../store/navegacao/useNavegacaoStore');

describe('RightBar Component', () => {
  const mockSetRightBarMenuItems = jest.fn(); // Not directly used by RightBar, but part of store
  let mockRightBarMenuItems: RightBarMenuItemType[] = [];

  beforeEach(() => {
    (useNavegacaoStore as jest.Mock).mockImplementation(() => ({
      menu: {
        rightBarMenuItems: mockRightBarMenuItems,
        // setRightBarMenuItems: mockSetRightBarMenuItems, // Not needed for rendering test
      },
    }));
  });

  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={techTheme}>{component}</ThemeProvider>);
  };

  test('renders "Nenhuma opção disponível." when no items are provided', () => {
    mockRightBarMenuItems = [];
    renderWithTheme(<RightBar />);
    expect(screen.getByText('Nenhuma opção disponível.')).toBeInTheDocument();
  });

  test('renders buttons correctly based on rightBarMenuItems', () => {
    const mockAction1 = jest.fn();
    const mockAction2 = jest.fn();
    mockRightBarMenuItems = [
      { id: 'item1', label: 'Filter Option 1', actionOnClick: mockAction1, isSelected: true },
      { id: 'item2', label: 'Filter Option 2', actionOnClick: mockAction2, isSelected: false },
    ];

    renderWithTheme(<RightBar />);

    const button1 = screen.getByText('Filter Option 1');
    const button2 = screen.getByText('Filter Option 2');

    expect(button1).toBeInTheDocument();
    expect(button2).toBeInTheDocument();

    // Check for selected state (variant='contained' for selected, 'outlined' for not)
    // MUI Buttons with variant="contained" might not directly expose that as a simple attribute
    // We can check style or a class if MUI adds one, or rely on visual snapshot testing.
    // For this unit test, we'll check if the action is called.
    // A more direct way to check variant would be to inspect class names if they are consistent.
    // For example, selected button might have 'MuiButton-containedPrimary'.

    expect(button1).toHaveClass('MuiButton-contained'); // Assuming 'contained' implies selected styling
    expect(button2).toHaveClass('MuiButton-outlined'); // Assuming 'outlined' for non-selected

    fireEvent.click(button1);
    expect(mockAction1).toHaveBeenCalledTimes(1);

    fireEvent.click(button2);
    expect(mockAction2).toHaveBeenCalledTimes(1);
  });

  test('renders buttons with icons if provided', () => {
    const MockIcon = () => <svg data-testid="mock-icon" />;
    mockRightBarMenuItems = [
      { id: 'item1', label: 'With Icon', actionOnClick: jest.fn(), isSelected: false, icon: <MockIcon /> },
    ];

    renderWithTheme(<RightBar />);
    expect(screen.getByText('With Icon')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });
});
