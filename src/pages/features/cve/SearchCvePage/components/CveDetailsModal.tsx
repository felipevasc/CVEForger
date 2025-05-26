import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import useBackendApi from '../../../../../api/backendApi'; // Assuming this hook exists and is configured

interface CveDetailsModalProps {
  open: boolean;
  onClose: () => void;
  cveId: string | null;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const CveDetailsModal: React.FC<CveDetailsModalProps> = ({
  open,
  onClose,
  cveId,
}) => {
  const api = useBackendApi(); // Used for initial data load
  const [informacoes, setInformacoes] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false); // For initial data load
  const [error, setError] = useState<string | null>(null); // For initial data load

  // New state for regeneration buttons
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  useEffect(() => {
    if (open && cveId) {
      setLoading(true);
      setError(null);
      setInformacoes(null); // Clear previous data
      api
        .getCveInformacoesJson(cveId) // Assuming this method exists on the hook
        .then((data) => {
          setInformacoes(data);
        })
        .catch((err) => {
          console.error('Error fetching CVE informacoes.json:', err);
          setError(
            `Failed to load details for ${cveId}. ${err.message || ''}`
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, cveId, api]);

  const handleRegenerateAnalysis = async () => {
    if (!cveId) return;
    setIsLoadingAnalysis(true);
    try {
      const response = await fetch(`/api/cve/analisar/${cveId.toUpperCase()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ erro: 'Unknown error during analysis regeneration.' }));
        throw new Error(errorData.erro || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      alert(`Analysis for ${cveId} re-generated successfully.\nFiles updated on server.\nDetails: ${JSON.stringify(result.resultado, null, 2)}`);
      // Optionally, you could re-fetch informacoes.json here if it's updated by analysis
      // For now, just alerting success.
    } catch (err: any) {
      console.error('Error re-generating analysis:', err);
      alert(`Failed to re-generate analysis for ${cveId}: ${err.message}`);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleRegenerateExplanation = async () => {
    if (!cveId) return;
    setIsLoadingExplanation(true);
    try {
      const response = await fetch(`/api/cve/explicar/${cveId.toUpperCase()}/json`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ erro: 'Unknown error during explanation regeneration.' }));
        throw new Error(errorData.erro || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      alert(`Explanation for ${cveId} re-generated successfully.\nFiles updated on server.\nDetails: ${JSON.stringify(result.resultado, null, 2)}`);
      // Optionally, you could refresh part of the modal if needed
    } catch (err: any) {
      console.error('Error re-generating explanation:', err);
      alert(`Failed to re-generate explanation for ${cveId}: ${err.message}`);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="cve-details-modal-title"
      aria-describedby="cve-details-modal-description">
      <Paper sx={modalStyle}>
        <Typography id="cve-details-modal-title" variant="h6" component="h2">
          CVE Details: {cveId || 'N/A'}
        </Typography>

        {loading && <CircularProgress sx={{ mt: 2 }} />}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {informacoes && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Informações (JSON):
            </Typography>
            <Paper
              variant="outlined"
              sx={{ p: 2, maxHeight: 400, overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', backgroundColor: 'grey.100' }}>
              <pre>{JSON.stringify(informacoes, null, 2)}</pre>
            </Paper>
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleRegenerateAnalysis}
            disabled={!cveId || loading || isLoadingAnalysis || isLoadingExplanation}>
            {isLoadingAnalysis ? 'Re-generating Analysis...' : 'Re-generate Analysis'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleRegenerateExplanation}
            disabled={!cveId || loading || isLoadingAnalysis || isLoadingExplanation}>
            {isLoadingExplanation ? 'Re-generating Explanation...' : 'Re-generate Explanation'}
          </Button>
          <Button 
            variant="contained" 
            onClick={onClose}
            disabled={isLoadingAnalysis || isLoadingExplanation} >
            Close
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default CveDetailsModal;
