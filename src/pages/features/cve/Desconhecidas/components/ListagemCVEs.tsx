import React from 'react';
import { Button, CircularProgress, Link as MuiLink } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Table, { type Column } from '../../../../../components/Table';

// Define a type for clarity, or use the generic one
interface CveObjectType { 
  id: string;
  platform: string; 
  // any other properties that might exist
  [key: string]: any;
}

interface ListagemCVEsProps {
  items: CveObjectType[]; // Use the new type
  registeringId: string | null;
  onRegister: (itemId: string) => void; // Parameter changed
}

export const ListagemCVEs: React.FC<ListagemCVEsProps> = ({
  items,
  registeringId,
  onRegister,
}) => {
  // Prepara os dados para o componente genérico
  const data = items.slice(0, 100).map((cveItem) => ({ // cveItem is now an object
    'Id da CVE': (
      <MuiLink
        href={`https://nvd.nist.gov/vuln/detail/${cveItem.id}`} // Use cveItem.id
        target='_blank'
        rel='noopener noreferrer'
        underline='hover'>
        {cveItem.id} // Use cveItem.id
      </MuiLink>
    ),
    Ação: (
      <Button
        variant='contained'
        size='small'
        startIcon={
          registeringId === cveItem.id ? ( // Use cveItem.id
            <CircularProgress size={16} color='inherit' />
          ) : (
            <AddTaskIcon />
          )
        }
        onClick={() => onRegister(cveItem.id)} // Use cveItem.id
        disabled={registeringId === cveItem.id} // Use cveItem.id
        sx={{ minWidth: 120 }}>
        {registeringId === cveItem.id ? 'Regist...' : 'Registrar'} // Use cveItem.id
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
