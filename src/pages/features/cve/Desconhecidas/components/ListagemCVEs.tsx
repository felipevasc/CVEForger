import React from 'react';
import { Button, CircularProgress, Link as MuiLink } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Table, { type Column } from '../../../../../components/Table';

interface ListagemCVEsProps {
  items: string[];
  registeringId: string | null;
  onRegister: (item: string) => void;
}

export const ListagemCVEs: React.FC<ListagemCVEsProps> = ({
  items,
  registeringId,
  onRegister,
}) => {
  // Prepara os dados para o componente genérico
  const data = items.slice(0, 100).map((cve) => ({
    'Id da CVE': (
      <MuiLink
        href={`https://nvd.nist.gov/vuln/detail/${cve}`}
        target='_blank'
        rel='noopener noreferrer'
        underline='hover'>
        {cve}
      </MuiLink>
    ),
    Ação: (
      <Button
        variant='contained'
        size='small'
        startIcon={
          registeringId === cve ? (
            <CircularProgress size={16} color='inherit' />
          ) : (
            <AddTaskIcon />
          )
        }
        onClick={() => onRegister(cve)}
        disabled={registeringId === cve}
        sx={{ minWidth: 120 }}>
        {registeringId === cve ? 'Regist...' : 'Registrar'}
      </Button>
    ),
  }));

  const columns: Column[] = [
    { field: 'Id da CVE', headerName: 'ID da CVE', align: 'left' },
    { field: 'Ação', headerName: 'Ação', align: 'center' },
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
