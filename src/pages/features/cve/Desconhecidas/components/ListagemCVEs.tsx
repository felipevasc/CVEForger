import React from 'react';
import { Button, CircularProgress, Link as MuiLink } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Table, { type Column } from '../../../../../components/Table';
import type { CveResponse } from '../../../../../api/backendApi/types/CveExploitDBResponse';
import { PlatformIcon } from '../../../../../components/PlataformIcon';

interface ListagemCVEsProps {
  items: CveResponse[];
  registeringId: string | null;
  onRegister: (item: string) => void;
}

export const ListagemCVEs: React.FC<ListagemCVEsProps> = ({
  items,
  registeringId,
  onRegister,
}) => {
  // Prepara os dados para o componente genérico
  const data = items
    .sort((a, b) => {
      const aTmp = a?.cve?.split('-');
      const bTmp = b?.cve?.split('-');
      if (aTmp?.[1] > bTmp?.[1]) {
        return -1;
      } else if (aTmp?.[1] < bTmp?.[1]) {
        return 1;
      } else {
        if (aTmp?.[2]?.padStart(10, '0') > bTmp?.[2]?.padStart(10, '0')) {
          return -1;
        } else if (aTmp?.[2] < bTmp?.[2]) {
          return 1;
        }
        return 0;
      }
    })
    .slice(0, 100)
    .map((cve) => ({
      cve: (
        <MuiLink
          href={`https://nvd.nist.gov/vuln/detail/${cve.cve}`}
          target='_blank'
          rel='noopener noreferrer'
          underline='hover'>
          {cve.cve}
        </MuiLink>
      ),
      description: cve.description,
      plataforma: <PlatformIcon platform={cve.platform} size={30} />,
      action: (
        <Button
          variant='contained'
          size='small'
          startIcon={
            registeringId === cve.cve ? (
              <CircularProgress size={16} color='inherit' />
            ) : (
              <AddTaskIcon />
            )
          }
          onClick={() => onRegister(cve.cve)}
          disabled={registeringId === cve.cve}
          sx={{ minWidth: 120 }}>
          {registeringId === cve.cve ? 'Regist...' : 'Registrar'}
        </Button>
      ),
    }));

  const columns: Column[] = [
    { field: 'plataforma', headerName: 'Plataforma', align: 'center' },
    { field: 'cve', headerName: 'CVE', align: 'center' },
    { field: 'description', headerName: 'Descrição', align: 'left' },
    { field: 'action', headerName: 'Ação', align: 'center' },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      title='Lista de CVEs Desconhecidas para Registro'
      maxHeight={350}
      minWidth={650}
    />
  );
};
