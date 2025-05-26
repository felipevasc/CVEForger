import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import useBackendApi from '../../../../api/backendApi';
import CveDetailsModal from './components/CveDetailsModal'; // Created in previous step

const SearchCvePage: React.FC = () => {
  const api = useBackendApi();
  const [cveList, setCveList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCve, setSelectedCve] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getDbCves() // Assuming this method exists on the backendApi hook
      .then((data: string[]) => { // Explicitly type data as string[]
        setCveList(data);
      })
      .catch((err) => {
        console.error('Error fetching CVE list:', err);
        setError(`Failed to load CVE list. ${err.message || ''}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api]);

  const handleOpenModal = (cveId: string) => {
    setSelectedCve(cveId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCve(null);
  };

  const handleViewDockerCompose = (cveId: string) => {
    // Construct URL for the backend endpoint.
    // Assuming backendApi has a getBaseUrl method or similar, or hardcode for now.
    // For simplicity, hardcoding relative path. Ensure your backend serves this.
    window.open(`/api/cve/${cveId}/docker-compose`, '_blank');
  };

  const handleViewExplanationHtml = (cveId: string) => {
    window.open(`/api/cve/${cveId}/explicacao-html`, '_blank');
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>Loading CVEs...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Search Known CVEs
      </Typography>
      {cveList.length === 0 && !loading ? (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No CVEs found in the database.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="cve table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>CVE ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cveList.map((cveId) => (
                <TableRow
                  key={cveId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {cveId}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenModal(cveId)}>
                        View Details
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewDockerCompose(cveId)}>
                        View docker-compose.yml
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewExplanationHtml(cveId)}>
                        View Explanation (HTML)
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {selectedCve && (
        <CveDetailsModal
          open={isModalOpen}
          onClose={handleCloseModal}
          cveId={selectedCve}
        />
      )}
    </Container>
  );
};

export default SearchCvePage;
