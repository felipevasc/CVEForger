import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchCvePage from './index';
import useBackendApi from '../../../../api/backendApi';

// Mock dependencies
jest.mock('../../../../api/backendApi');

// Mock child components
jest.mock('./components/CveDetailsModal', () => ({ open, onClose, cveId }: any) => (
  open ? <div data-testid="cve-details-modal">Modal for {cveId} <button onClick={onClose}>Close Modal</button></div> : null
));

const mockGetDbCves = jest.fn();
global.fetch = jest.fn(); // Mock global fetch for any direct calls if useBackendApi is not exhaustive
window.open = jest.fn(); // Mock window.open

describe('SearchCvePage', () => {
  beforeEach(() => {
    (useBackendApi as jest.Mock).mockReturnValue({
      getDbCves: mockGetDbCves,
      // Assuming other methods like getCveInformacoesJson might be part of useBackendApi
      // but CveDetailsModal might use its own fetch or a passed-in api object.
      // For this test, we primarily care about getDbCves from the page.
    });
    mockGetDbCves.mockReset();
    (window.open as jest.Mock).mockClear();
  });

  const mockCveList = ['CVE-2024-0001', 'CVE-2024-0002'];

  test('fetches CVEs from /api/cve/db and displays them in a table', async () => {
    mockGetDbCves.mockResolvedValue(mockCveList);

    render(<SearchCvePage />);

    await waitFor(() => {
      expect(mockGetDbCves).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('Search Known CVEs')).toBeInTheDocument();
    expect(screen.getByText('CVE-2024-0001')).toBeInTheDocument();
    expect(screen.getByText('CVE-2024-0002')).toBeInTheDocument();
    // Check for table headers
    expect(screen.getByText('CVE ID')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('shows loading state initially and error state on fetch failure', async () => {
    // Test Loading State
    mockGetDbCves.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<SearchCvePage />);
    expect(screen.getByText('Loading CVEs...')).toBeInTheDocument();

    // Test Error State
    mockGetDbCves.mockRejectedValue(new Error('Failed to fetch'));
    render(<SearchCvePage />); // Re-render for error state
    await waitFor(() => {
      expect(screen.getByText(/Failed to load CVE list/i)).toBeInTheDocument();
    });
  });
  
  test('opens CveDetailsModal when "View Details" is clicked', async () => {
    mockGetDbCves.mockResolvedValue(['CVE-2024-0001']);
    render(<SearchCvePage />);

    await waitFor(() => {
      expect(screen.getByText('CVE-2024-0001')).toBeInTheDocument();
    });

    // Find the "View Details" button for CVE-2024-0001.
    // This assumes a structure where the button is identifiable.
    // A more robust way would be to have data-testid attributes on buttons.
    const viewDetailsButton = screen.getAllByText('View Details')[0];
    fireEvent.click(viewDetailsButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('cve-details-modal')).toBeInTheDocument();
      expect(screen.getByText('Modal for CVE-2024-0001')).toBeInTheDocument();
    });

    // Test closing the modal
    fireEvent.click(screen.getByText('Close Modal'));
    await waitFor(() => {
        expect(screen.queryByTestId('cve-details-modal')).not.toBeInTheDocument();
    });
  });

  test('calls window.open with correct URL for "View docker-compose.yml"', async () => {
    mockGetDbCves.mockResolvedValue(['CVE-2024-0001']);
    render(<SearchCvePage />);
    
    await waitFor(() => screen.getByText('CVE-2024-0001'));
    
    const dockerComposeButton = screen.getAllByText('View docker-compose.yml')[0];
    fireEvent.click(dockerComposeButton);
    
    expect(window.open).toHaveBeenCalledWith('/api/cve/CVE-2024-0001/docker-compose', '_blank');
  });

  test('calls window.open with correct URL for "View Explanation (HTML)"', async () => {
    mockGetDbCves.mockResolvedValue(['CVE-2024-0001']);
    render(<SearchCvePage />);

    await waitFor(() => screen.getByText('CVE-2024-0001'));

    const explanationButton = screen.getAllByText('View Explanation (HTML)')[0];
    fireEvent.click(explanationButton);

    expect(window.open).toHaveBeenCalledWith('/api/cve/CVE-2024-0001/explicacao-html', '_blank');
  });
});
