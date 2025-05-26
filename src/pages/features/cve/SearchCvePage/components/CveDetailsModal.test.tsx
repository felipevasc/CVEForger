import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CveDetailsModal from './CveDetailsModal';
import useBackendApi from '../../../../../api/backendApi'; // Assuming this is where getCveInformacoesJson would live

// Mock useBackendApi
jest.mock('../../../../../api/backendApi');

const mockGetCveInformacoesJson = jest.fn();
global.fetch = jest.fn(); // For re-generate buttons

describe('CveDetailsModal', () => {
  const mockCveId = 'CVE-2024-1234';

  beforeEach(() => {
    (useBackendApi as jest.Mock).mockReturnValue({
      getCveInformacoesJson: mockGetCveInformacoesJson,
    });
    mockGetCveInformacoesJson.mockReset();
    (global.fetch as jest.Mock).mockReset();
    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert
  });

  afterEach(() => {
    (window.alert as jest.Mock).mockRestore();
  });

  test('fetches and displays CVE information when opened', async () => {
    const mockInfoData = { description: 'Test CVE details', severity: 'HIGH' };
    mockGetCveInformacoesJson.mockResolvedValue(mockInfoData);

    render(<CveDetailsModal open={true} onClose={jest.fn()} cveId={mockCveId} />);

    await waitFor(() => {
      expect(mockGetCveInformacoesJson).toHaveBeenCalledWith(mockCveId);
    });

    expect(screen.getByText(`CVE Details: ${mockCveId}`)).toBeInTheDocument();
    expect(screen.getByText(JSON.stringify(mockInfoData, null, 2))).toBeInTheDocument();
  });

  test('shows loading state for initial data and error message on failure', async () => {
    // Loading state (promise never resolves)
    mockGetCveInformacoesJson.mockImplementation(() => new Promise(() => {}));
    const { rerender } = render(<CveDetailsModal open={true} onClose={jest.fn()} cveId={mockCveId} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument(); // MUI CircularProgress

    // Error state
    mockGetCveInformacoesJson.mockRejectedValue(new Error('Fetch failed'));
    rerender(<CveDetailsModal open={true} onClose={jest.fn()} cveId={mockCveId} />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load details/i)).toBeInTheDocument();
    });
  });

  test('"Re-generate Analysis" button calls correct API and shows feedback', async () => {
    mockGetCveInformacoesJson.mockResolvedValue({}); // Initial load
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ resultado: { analysis: 'done' } }),
    });

    render(<CveDetailsModal open={true} onClose={jest.fn()} cveId={mockCveId} />);
    
    await waitFor(() => expect(mockGetCveInformacoesJson).toHaveBeenCalled()); // Wait for initial load

    const regenerateAnalysisButton = screen.getByText('Re-generate Analysis');
    fireEvent.click(regenerateAnalysisButton);

    expect(screen.getByText('Re-generating Analysis...')).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/cve/analisar/${mockCveId.toUpperCase()}`);
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Analysis for CVE-2024-1234 re-generated successfully.'));
    });
    expect(screen.getByText('Re-generate Analysis')).toBeInTheDocument(); // Back to normal
  });

  test('"Re-generate Explanation" button calls correct API and shows feedback', async () => {
    mockGetCveInformacoesJson.mockResolvedValue({}); // Initial load
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ resultado: { explanation: 'done' } }),
    });

    render(<CveDetailsModal open={true} onClose={jest.fn()} cveId={mockCveId} />);

    await waitFor(() => expect(mockGetCveInformacoesJson).toHaveBeenCalled()); // Wait for initial load

    const regenerateExplanationButton = screen.getByText('Re-generate Explanation');
    fireEvent.click(regenerateExplanationButton);

    expect(screen.getByText('Re-generating Explanation...')).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/cve/explicar/${mockCveId.toUpperCase()}/json`);
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Explanation for CVE-2024-1234 re-generated successfully.'));
    });
    expect(screen.getByText('Re-generate Explanation')).toBeInTheDocument(); // Back to normal
  });
  
  test('buttons are disabled during API calls', async () => {
    mockGetCveInformacoesJson.mockResolvedValue({});
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Simulate long API call

    render(<CveDetailsModal open={true} onClose={jest.fn()} cveId={mockCveId} />);
    await waitFor(() => expect(mockGetCveInformacoesJson).toHaveBeenCalled());

    const analysisButton = screen.getByText('Re-generate Analysis');
    const explanationButton = screen.getByText('Re-generate Explanation');
    const closeButton = screen.getByText('Close');

    fireEvent.click(analysisButton);
    await waitFor(() => expect(screen.getByText('Re-generating Analysis...')).toBeInTheDocument());
    
    expect(analysisButton).toBeDisabled();
    expect(explanationButton).toBeDisabled();
    expect(closeButton).toBeDisabled();
  });
});
