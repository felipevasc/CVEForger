import React, { useEffect, useMemo, useState } from 'react';
import { Container, Paper, CssBaseline } from '@mui/material';
import { PainelResumo } from './components/PainelResumo';
import { ListagemCVEs } from './components/ListagemCVEs';
import useBackendApi from '../../../../api/backendApi';
import type { CveExpoitDBResponse } from '../../../../api/backendApi/types/CveExploitDBResponse';

const Desconhecidas: React.FC = () => {
  const api = useBackendApi();
  const [extData, setExtData] = useState<CveExpoitDBResponse | undefined>();

  useEffect(() => {
    api.obterCVEsExploitDB().then((r) => {
      setExtData(r);
    });
  }, []);

  const unknowns = useMemo(() => {
    return extData?.cves;
  }, [extData]);

  const handleRegister = async (cveId: string) => {
    // lógica de registro...
    console.log(cveId);
  };

  return (
    <>
      <CssBaseline />
      <Container sx={{ py: 4 }} maxWidth='lg'>
        {
          <>
            <PainelResumo
              fonte={extData?.fonte}
              totalExternal={extData?.totalCVEs}
              knownCount={0}
              unknownCount={0}
            />
            {!unknowns?.length ? (
              <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
                <p>Nenhuma CVE nova encontrada.</p>
              </Paper>
            ) : (
              <ListagemCVEs
                items={unknowns ?? []}
                registeringId={null}
                onRegister={handleRegister}
              />
            )}
          </>
        }
      </Container>
    </>
  );
};

export default Desconhecidas;
