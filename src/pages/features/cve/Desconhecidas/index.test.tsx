import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Desconhecidas from './index';
import useBackendApi from '../../../../api/backendApi';
import useNavegacaoStore from '../../../../store/navegacao/useNavegacaoStore';

// Mock dependencies
jest.mock('../../../../api/backendApi');
jest.mock('../../../../store/navegacao/useNavegacaoStore');

// Mock child components to simplify testing focus
jest.mock('./components/PainelResumo', () => () => <div data-testid="painel-resumo">PainelResumo</div>);
jest.mock('./components/ListagemCVEs', () => ({ items, registeringId, onRegister }: any) => (
  <div data-testid="listagem-cves">
    {items.map((item: any) => (
      <div key={item.id} data-testid={`cve-item-${item.id}`}>
        {item.id}
        <button onClick={() => onRegister(item.id)}>
          Register {item.id} {registeringId === item.id ? '(Loading)' : ''}
        </button>
      </div>
    ))}
  </div>
));


const mockObterCVEsExploitDB = jest.fn();
const mockSetRightBarMenuItems = jest.fn();

global.fetch = jest.fn(); // Mock global fetch

describe('Desconhecidas Page', () => {
  beforeEach(() => {
    (useBackendApi as jest.Mock).mockReturnValue({
      obterCVEsExploitDB: mockObterCVEsExploitDB,
    });
    (useNavegacaoStore as jest.Mock).mockReturnValue({
      menu: {
        setRightBarMenuItems: mockSetRightBarMenuItems,
      },
    });
    mockObterCVEsExploitDB.mockReset();
    (global.fetch as jest.Mock).mockReset();
    mockSetRightBarMenuItems.mockClear();
  });

  const mockExternalCVEs = {
    fonte: 'Exploit-DB',
    totalCVEs: 3,
    cves: [
      { id: 'CVE-2023-0001', platform: 'linux', description: 'Test CVE 1' },
      { id: 'CVE-2023-0002', platform: 'windows', description: 'Test CVE 2' },
      { id: 'CVE-2023-0003', platform: 'multiple', description: 'Test CVE 3' },
    ],
  };

  test('fetches external and known CVEs, filters, and displays unknown CVEs', async () => {
    mockObterCVEsExploitDB.mockResolvedValue(mockExternalCVEs);
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ // For /api/cve/db
        ok: true,
        json: async () => ['CVE-2023-0001', 'CVE-2023-0004'], // CVE-2023-0001 is known
      });

    render(<Desconhecidas />);

    await waitFor(() => {
      expect(mockObterCVEsExploitDB).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/api/cve/db');
    });

    // After fetching and filtering:
    // CVE-2023-0001 is known, so it should be filtered out.
    // CVE-2023-0002 and CVE-2023-0003 should be displayed.
    await waitFor(() => {
      expect(screen.queryByTestId('cve-item-CVE-2023-0001')).not.toBeInTheDocument();
      expect(screen.getByTestId('cve-item-CVE-2023-0002')).toBeInTheDocument();
      expect(screen.getByTestId('cve-item-CVE-2023-0003')).toBeInTheDocument();
    });
  });

  test('handleRegister successfully registers a CVE and updates UI', async () => {
    mockObterCVEsExploitDB.mockResolvedValue({
      ...mockExternalCVEs,
      cves: [{ id: 'CVE-2023-0002', platform: 'windows', description: 'Test CVE 2' }],
    });
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ // For /api/cve/db initially (empty known)
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({ // For POST /api/cve/registrar/CVE-2023-0002
        ok: true,
        json: async () => ({ mensagem: 'CVE CVE-2023-0002 registered successfully.' }),
      });
    
    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert

    render(<Desconhecidas />);

    await waitFor(() => {
      expect(screen.getByTestId('cve-item-CVE-2023-0002')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Register CVE-2023-0002'));

    // Check if loading state is shown (simplified by mock)
    // await waitFor(() => {
    //   expect(screen.getByText('Register CVE-2023-0002 (Loading)')).toBeInTheDocument();
    // });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/cve/registrar/CVE-2023-0002', { method: 'POST' });
      expect(window.alert).toHaveBeenCalledWith('CVE CVE-2023-0002 registered successfully!\nCVE CVE-2023-0002 registered successfully.');
    });

    // CVE should be removed from the list and added to known (which means it won't be in 'unknowns')
    await waitFor(() => {
      expect(screen.queryByTestId('cve-item-CVE-2023-0002')).not.toBeInTheDocument();
    });
    
    (window.alert as jest.Mock).mockRestore();
  });
  
  // TODO: Add tests for platform filtering interaction with RightBar
  // This would involve mocking setRightBarMenuItems, capturing its callback,
  // and then simulating a click to change selectedPlatforms.
});
