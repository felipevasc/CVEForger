// src/pages/Desconhecidas.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Link as MuiLink, // Renomeado para evitar conflito com o Link do router se usado
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security'; // Ícone para o cabeçalho
import AddTaskIcon from '@mui/icons-material/AddTask'; // Ícone para o botão registrar
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Ícone para erro
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Ícone para info
import ScienceIcon from '@mui/icons-material/Science'; // Ícone para a fonte de dados

// --- Definição do Tema ---
const techTheme = createTheme({
  palette: {
    mode: 'light', // 'light' ou 'dark'
    primary: {
      main: '#007bff', // Um azul vibrante
      // main: '#0D47A1', // Azul escuro
    },
    secondary: {
      main: '#6c757d', // Um cinza neutro
    },
    background: {
      default: '#f4f6f8', // Um cinza muito claro para o fundo da página
      paper: '#ffffff', // Branco para os contêineres de papel
    },
    text: {
      primary: '#212529',
      secondary: '#495057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#343a40',
    },
    h5: {
      fontWeight: 600,
      color: '#343a40',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // AppBar branco para um look mais clean
          color: '#343a40',
          boxShadow: '0 2px 4px -1px rgba(0,0,0,0.1)', // Sombra sutil
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Botões levemente arredondados
          textTransform: 'none', // Sem uppercase por padrão
          fontWeight: 600,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#e9ecef', // Cabeçalho da tabela com um cinza leve
          '& .MuiTableCell-root': {
            fontWeight: 'bold',
            color: '#495057',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Bordas mais arredondadas para Paper
        },
      },
    },
  },
});

// --- Interfaces para os dados ---

// Resposta da sua nova API /api/cves/exploitdb
interface ExploitDbCvesApiResponse {
  fonte: string;
  totalCVEs: number;
  cves: string[]; // Array de IDs de CVE, ex: ["CVE-1999-0002", ...]
}

// Interface para os itens que serão exibidos na tabela (simplificada)
interface UnknownCveDisplayItem {
  cveId: string;
  // Não temos mais detalhes como descrição, autor, etc., desta API
}

// --- Componente Principal ---

const Desconhecidas: React.FC = () => {
  const [knownCveIds, setKnownCveIds] = useState<string[]>([]);
  const [exploitDbCveSourceInfo, setExploitDbCveSourceInfo] = useState<{
    fonte: string;
    total: number;
  } | null>(null);
  const [unknownCves, setUnknownCves] = useState<UnknownCveDisplayItem[]>([]);

  const [loadingKnownCves, setLoadingKnownCves] = useState<boolean>(true);
  const [loadingExploitDbCves, setLoadingExploitDbCves] =
    useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [registeringCveId, setRegisteringCveId] = useState<string | null>(null);

  const YOUR_BACKEND_EXPLOITDB_ENDPOINT =
    'http://localhost:3001/api/cves/exploitdb';

  // 1. Buscar CVEs conhecidas da API interna (/cves)
  useEffect(() => {
    const fetchKnownCves = async () => {
      setLoadingKnownCves(true);
      // setError(null); // Não resetar aqui para manter erros de outras chamadas
      try {
        const response = await fetch('http://localhost:3001/api/cves/db'); // Assumindo que esta é a API da sua aplicação
        if (!response.ok) {
          throw new Error(
            `Erro ${response.status} ao buscar CVEs conhecidas: ${response.statusText}`
          );
        }
        const data = await response.json();
        setKnownCveIds(data?.cves?.map((id: string) => id.toUpperCase()) ?? []);
      } catch (err) {
        console.error(err);
        setError((prev) =>
          prev ? `${prev}\n${(err as Error).message}` : (err as Error).message
        );
      } finally {
        setLoadingKnownCves(false);
      }
    };
    fetchKnownCves();
  }, []);

  // 2. Buscar CVEs do Exploit-DB através da sua nova API de backend
  useEffect(() => {
    const fetchExploitDbCvesFromBackend = async () => {
      setLoadingExploitDbCves(true);
      // setError(null);
      try {
        const response = await fetch(YOUR_BACKEND_EXPLOITDB_ENDPOINT);
        if (!response.ok) {
          throw new Error(
            `Erro ${response.status} ao buscar CVEs do Exploit-DB (via Backend): ${response.statusText}`
          );
        }
        const data: ExploitDbCvesApiResponse = await response.json();

        setExploitDbCveSourceInfo({
          fonte: data?.fonte ?? 'desconhecida',
          total: data?.totalCVEs ?? 0,
        });

        // Processar somente quando as CVEs conhecidas também estiverem carregadas (ou falharem)
        if (!loadingKnownCves) {
          processAndSetUnknownCves(data.cves, knownCveIds);
        } else {
          // Armazena para processamento posterior no useEffect de dependência
          // Isso é um fallback, o ideal é que o useEffect abaixo lide com isso
          localStorage.setItem('tempExploitDbCves', JSON.stringify(data.cves));
        }
      } catch (err) {
        console.error(err);
        setError((prev) =>
          prev ? `${prev}\n${(err as Error).message}` : (err as Error).message
        );
      } finally {
        setLoadingExploitDbCves(false);
      }
    };
    if (!loadingKnownCves) {
      // Somente buscar se as CVEs conhecidas já foram carregadas
      fetchExploitDbCvesFromBackend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingKnownCves]); // knownCveIds não é dependência aqui para evitar re-fetch da API externa, processamento é separado.

  // Função para processar e definir CVEs desconhecidas
  const processAndSetUnknownCves = useCallback(
    (exploitDbIds: string[], currentKnownIds: string[]) => {
      const uniqueExploitDbIds = new Set(
        exploitDbIds.map((id) => id.toUpperCase())
      );
      const currentKnownIdsSet = new Set(
        currentKnownIds.map((id) => id.toUpperCase())
      );
      console.log('IDs conhecidos:', currentKnownIdsSet);
      console.log('IDs do Exploit-DB:', uniqueExploitDbIds);

      const foundUnknownCves: UnknownCveDisplayItem[] = [];
      uniqueExploitDbIds.forEach((cveId) => {
        if (!currentKnownIdsSet.has(cveId)) {
          foundUnknownCves.push({ cveId });
        }
      });
      setUnknownCves(
        foundUnknownCves.sort((a, b) => a.cveId.localeCompare(b.cveId))
      ); // Ordena por ID

      // Limpa o item temporário do localStorage se usado
      localStorage.removeItem('tempExploitDbCves');
    },
    []
  );

  // 3. Efeito para processar os dados quando AMBAS as fontes estiverem prontas
  useEffect(() => {
    if (!loadingKnownCves && !loadingExploitDbCves) {
      const storedExploitDbCves = localStorage.getItem('tempExploitDbCves');
      let exploitDbCvesToProcess: string[] = [];

      if (exploitDbCveSourceInfo?.total) {
        // Se já pegou da API e setou exploitDbCveSourceInfo
        // Precisamos garantir que pegamos a lista de CVEs associada a exploitDbCveSourceInfo.
        // A lógica atual busca e tenta processar. Se a API `YOUR_BACKEND_EXPLOITDB_ENDPOINT`
        // não for chamada de novo, precisamos dos dados dela.
        // Uma melhoria seria armazenar `data.cves` em um estado e usar esse estado aqui.
        // Vamos refatorar para usar um estado para raw ExploitDB CVEs.
      }

      // Para simplificar e garantir que temos os dados corretos para processamento:
      // Vamos refatorar o fetchExploitDbCvesFromBackend para armazenar os `data.cves` em um estado.
      // E este useEffect vai depender desse estado. (Já meio que faz isso com o processAndSetUnknownCves sendo chamado lá)
      // O fluxo atual deve ser:
      // 1. Fetch knownCveIds -> setLoadingKnownCves(false)
      // 2. Fetch ExploitDB CVEs -> setLoadingExploitDbCves(false), chama processAndSetUnknownCves(data.cves, knownCveIds)
      //    se loadingKnownCves já for false.
      // Este useEffect é um "backup" ou para re-processamento se knownCveIds mudar após ExploitDB já ter carregado.

      // Se knownCveIds carregou depois de exploitDbCves
      if (storedExploitDbCves && knownCveIds.length > 0) {
        try {
          exploitDbCvesToProcess = JSON.parse(storedExploitDbCves);
          processAndSetUnknownCves(exploitDbCvesToProcess, knownCveIds);
        } catch (e) {
          console.error('Erro ao parsear CVEs do localStorage', e);
        }
      }
      // O caso principal é coberto pela chamada de processAndSetUnknownCves dentro do fetch de ExploitDB
      // quando loadingKnownCves já é false.
    }
  }, [
    loadingKnownCves,
    loadingExploitDbCves,
    knownCveIds,
    processAndSetUnknownCves,
    exploitDbCveSourceInfo,
  ]);

  // 4. Função para registrar CVE
  const handleRegisterCve = async (cveItem: UnknownCveDisplayItem) => {
    setRegisteringCveId(cveItem.cveId);
    // setError(null); // Não apagar outros erros
    let registrationError: string | null = null;
    try {
      const payload = {
        cveId: cveItem.cveId,
        source:
          exploitDbCveSourceInfo?.fonte || 'Exploit-DB (origem desconhecida)',
        // Adicione quaisquer outros campos que sua API /cve/registrar possa necessitar/aceitar
        // Como não temos mais detalhes do exploit, o payload é mínimo.
      };

      const response = await fetch('/cve/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Falha ao registrar CVE ${cveItem.cveId}: ${response.statusText} (${response.status}) - ${errorData}`
        );
      }

      // Sucesso
      alert(`CVE ${cveItem.cveId} registrada com sucesso!`);
      // Remover da lista de desconhecidas e adicionar à lista de conhecidas (localmente)
      setUnknownCves((prev) =>
        prev.filter((item) => item.cveId !== cveItem.cveId)
      );
      setKnownCveIds((prev) => [...prev, cveItem.cveId.toUpperCase()].sort());
    } catch (err) {
      console.error(err);
      registrationError = (err as Error).message;
      setError((prev) =>
        prev ? `${prev}\n${registrationError}` : registrationError
      );
      alert(`Erro ao registrar ${cveItem.cveId}: ${registrationError}`);
    } finally {
      setRegisteringCveId(null);
    }
  };

  const isLoading = loadingKnownCves || loadingExploitDbCves;

  return (
    <ThemeProvider theme={techTheme}>
      <CssBaseline />{' '}
      {/* Garante estilos base consistentes e aplicação do background do tema */}
      <AppBar
        position='static'
        elevation={0}
        sx={{ borderBottom: `1px solid ${techTheme.palette.divider}` }}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2, color: techTheme.palette.primary.main }}>
            <SecurityIcon fontSize='large' />
          </IconButton>
          <Typography
            variant='h5'
            component='div'
            sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Análise de CVEs Desconhecidas
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }} maxWidth='lg'>
        {isLoading && (
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            minHeight='60vh'>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant='h6' component='p' color='textSecondary'>
              Consultando fontes de dados...
            </Typography>
          </Box>
        )}

        {!isLoading && error && (
          <Alert
            severity='error'
            icon={<ErrorOutlineIcon />}
            sx={{ my: 2, '& .MuiAlert-message': { overflow: 'auto' } }}>
            <Typography variant='h6' gutterBottom>
              Ocorreu um Erro:
            </Typography>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                maxHeight: 200,
                overflowY: 'auto',
              }}>
              {error}
            </pre>
          </Alert>
        )}

        {!isLoading && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {exploitDbCveSourceInfo && (
              <Grid>
                <Paper
                  elevation={2}
                  sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <ScienceIcon color='primary' sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant='subtitle1' color='textSecondary'>
                      Fonte Externa de CVEs:
                    </Typography>
                    <Typography variant='h6'>
                      {exploitDbCveSourceInfo.fonte}
                    </Typography>
                    <Typography variant='body1'>
                      Total de CVEs listadas:{' '}
                      {exploitDbCveSourceInfo.total.toLocaleString('pt-BR')}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )}
            <Grid>
              <Paper
                elevation={2}
                sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <AddTaskIcon color='primary' sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant='subtitle1' color='textSecondary'>
                    CVEs em sua Base:
                  </Typography>
                  <Typography variant='h6'>
                    {knownCveIds.length.toLocaleString('pt-BR')}
                  </Typography>
                  <Typography variant='body1'>
                    CVEs Descobertas (não registradas):{' '}
                    {unknownCves.length.toLocaleString('pt-BR')}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {!isLoading && unknownCves.length === 0 && !error && (
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
            <InfoOutlinedIcon
              sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant='h6' component='p' color='textSecondary'>
              Nenhuma CVE nova encontrada para registro.
            </Typography>
            <Typography variant='body1' color='textSecondary'>
              Todas as CVEs da fonte externa já parecem estar em sua base de
              dados.
            </Typography>
          </Paper>
        )}

        {!isLoading && unknownCves.length > 0 && (
          <Paper elevation={3} sx={{ overflow: 'auto' }}>
            {' '}
            {/* Para conter a TableContainer */}
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${techTheme.palette.divider}`,
              }}>
              <Typography variant='h5' component='h2'>
                Lista de CVEs Desconhecidas para Registro
              </Typography>
            </Box>
            <TableContainer>
              <Table
                sx={{ minWidth: 650 }}
                aria-label='tabela de cves desconhecidas'>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '70%' }}>ID da CVE</TableCell>
                    <TableCell align='center'>Ação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unknownCves
                    ?.filter((_, i) => i < 100)
                    ?.map((cve) => (
                      <TableRow
                        hover
                        key={cve.cveId}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}>
                        <TableCell component='th' scope='row'>
                          <MuiLink
                            href={`https://nvd.nist.gov/vuln/detail/${cve.cveId}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            underline='hover'
                            fontWeight='medium'>
                            {cve.cveId}
                          </MuiLink>
                        </TableCell>
                        <TableCell align='center'>
                          <Button
                            variant='contained'
                            color='primary'
                            size='small'
                            startIcon={
                              registeringCveId === cve.cveId ? (
                                <CircularProgress size={16} color='inherit' />
                              ) : (
                                <AddTaskIcon />
                              )
                            }
                            onClick={() => handleRegisterCve(cve)}
                            disabled={registeringCveId === cve.cveId}
                            sx={{ minWidth: 120 }}>
                            {registeringCveId === cve.cveId
                              ? 'Regist...'
                              : 'Registrar'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Desconhecidas;
