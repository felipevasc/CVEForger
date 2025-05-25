import React, { useEffect, useMemo, useState } from 'react';
import { Container, Paper, CssBaseline } from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material'; // Added
import type { RightBarMenuItemType } from '../../../../store/navegacao/types/RightBarMenuItemType'; // Added
import { PainelResumo } from './components/PainelResumo';
import { ListagemCVEs } from './components/ListagemCVEs';
import useBackendApi from '../../../../api/backendApi';
import type { CveExpoitDBResponse } from '../../../../api/backendApi/types/CveExploitDBResponse';
import useNavegacaoStore from '../../../../store/navegacao/useNavegacaoStore';

const Desconhecidas: React.FC = () => {
  const api = useBackendApi();
  const [extData, setExtData] = useState<CveExpoitDBResponse | undefined>();
  const { menu } = useNavegacaoStore(); // Added
  const { setRightBarMenuItems } = menu; // Added

  // Define Mock Platforms:
  const MOCK_PLATFORMS = useMemo(
    () => ['windows', 'linux', 'macos', 'android', 'ios', 'network gear'],
    []
  ); // Updated to lowercase

  // State for Selected Platforms:
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]); // Added

  useEffect(() => {
    api.obterCVEsExploitDB().then((r) => {
      setExtData(r);
    });
  }, []);

  // Effect to Set/Update RightBar Menu Items:
  useEffect(() => {
    if (setRightBarMenuItems) {
      // Check if handler is available
      const platformItems: RightBarMenuItemType[] = MOCK_PLATFORMS.map(
        (platform) => ({
          id: `platform-${platform}`,
          label: platform,
          icon: <FilterListIcon />, // Use a consistent icon for now
          actionOnClick: () => {
            setSelectedPlatforms((prev) =>
              prev.includes(platform)
                ? prev.filter((p) => p !== platform)
                : [...prev, platform]
            );
          },
          isSelected: selectedPlatforms.includes(platform),
        })
      );
      setRightBarMenuItems(platformItems);
    }

    // Cleanup function to clear RightBar items when component unmounts
    return () => {
      if (setRightBarMenuItems) {
        setRightBarMenuItems([]);
      }
    };
  }, [setRightBarMenuItems, selectedPlatforms, MOCK_PLATFORMS]);

  const unknowns = useMemo(() => {
    // Ensure extData and extData.cves exist before trying to filter
    if (!extData || !extData.cves) {
      return []; // Return empty array if no data
    }

    // Assuming extData.cves is an array of objects, where each object has a 'platform' property.
    // If extData.cves is string[], this will FAIL. This needs to be addressed if that's the case.
    const cveObjects = extData.cves;

    if (selectedPlatforms.length > 0 && cveObjects) {
      return cveObjects.filter(
        (cve) =>
          cve.platform && selectedPlatforms.includes(cve.platform.toLowerCase())
      );
    }
    return cveObjects; // Return all if no platforms selected or if cveObjects is null/undefined
  }, [extData, selectedPlatforms]);

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
