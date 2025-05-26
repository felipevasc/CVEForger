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
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [knownCveIds, setKnownCveIds] = useState<string[]>([]); // Added state for known CVEs
  const { menu } = useNavegacaoStore();
  const { setRightBarMenuItems } = menu;

  // Define Mock Platforms:
  const MOCK_PLATFORMS = useMemo(
    () => ['multiple', 'windows', 'linux', 'macos', 'android', 'ios', 'php', 'python', 'java', 'hardware', 'typescript'],
    []
  ); // Updated to lowercase

  // State for Selected Platforms:
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]); // Added

  useEffect(() => {
    // Fetch external CVEs
    api.obterCVEsExploitDB().then((r) => {
      setExtData(r);
    }).catch(error => {
      console.error("Failed to fetch external CVEs:", error);
      // Optionally, set an error state here to inform the user
    });

    // Fetch known CVEs from /api/cve/db
    fetch('/api/cve/db')
      .then(res => {
        if (!res.ok) {
          // If the server responds with a 404 (e.g., output directory not found),
          // treat it as no known CVEs rather than a fatal error for this component.
          if (res.status === 404) {
            return res.json().then(data => {
              console.warn("Known CVEs endpoint returned 404:", data.message || "Output directory likely not found.");
              return []; // Return empty array
            });
          }
          throw new Error(`Failed to fetch known CVEs: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: string[]) => {
        setKnownCveIds(data.map(id => id.toUpperCase())); // Standardize to uppercase
      })
      .catch(error => {
        console.error("Failed to fetch or parse known CVEs:", error);
        // Handle error, maybe show a notification to the user or set an error state
        // For now, we'll let the knownCveIds remain empty, so all external CVEs will be shown.
      });
  }, [api]); // api is a dependency

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
      return [];
    }

    let filteredCves = extData.cves;

    // 1. Filter by selected platforms
    if (selectedPlatforms.length > 0) {
      filteredCves = filteredCves.filter(
        (cve) =>
          cve.platform && selectedPlatforms.includes(cve.platform.toLowerCase())
      );
    }

    // 2. Filter out known CVEs
    // Ensure knownCveIds is not empty and has been populated before filtering
    if (knownCveIds.length > 0) {
      filteredCves = filteredCves.filter(
        (cve) => !knownCveIds.includes(cve.id.toUpperCase()) // Ensure comparison is standardized
      );
    }

    return filteredCves;
  }, [extData, selectedPlatforms, knownCveIds]); // Added knownCveIds dependency

  const handleRegister = async (cveId: string) => { // cveId here is the string ID like "CVE-2023-1234"
    setRegisteringId(cveId);
    try {
      const response = await fetch(`/api/cve/registrar/${cveId}`, {
        method: 'POST',
        // Headers might be needed if your API requires them (e.g., for auth or Content-Type)
        // headers: {
        //   'Content-Type': 'application/json',
        // },
      });

      if (!response.ok) {
        // Try to parse error response from backend if available
        const errorData = await response.json().catch(() => ({ erro: 'Failed to register CVE. Unknown error.' }));
        throw new Error(errorData.erro || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('CVE registered successfully:', result);
      alert(`CVE ${cveId} registered successfully!\n${result.mensagem}`);

      // Remove the registered CVE from the extData.cves list (optimistic update)
      setExtData((prevData) => {
        if (!prevData || !prevData.cves) return prevData;
        return {
          ...prevData,
          cves: prevData.cves.filter((cve) => cve.id.toUpperCase() !== cveId.toUpperCase()),
        };
      });

      // Add to knownCveIds list (optimistic update)
      setKnownCveIds(prevKnown => [...prevKnown, cveId.toUpperCase()]);

    } catch (error: any) {
      console.error('Error registering CVE:', error);
      alert(`Error registering CVE ${cveId}: ${error.message}`);
    } finally {
      setRegisteringId(null);
    }
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
                registeringId={registeringId} // Pass registeringId
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
