/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Table as MuiTable,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

export interface Column {
  field: string;
  headerName?: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  render?: (value: any, row: Record<string, any>) => React.ReactNode;
}

interface TableProps {
  /** Dados para preencher as linhas da tabela */
  data: Record<string, any>[];
  /** Definições de colunas (opcional). Se não informado, será inferido a partir das chaves de `data[0]`. */
  columns?: Column[];
  /** Título opcional exibido acima da tabela */
  title?: string;
  /** Altura máxima do container (padrão 350) */
  maxHeight?: number | string;
  /** Largura mínima da tabela (padrão 650) */
  minWidth?: number | string;
  /** Se o header deve ficar fixo ao rolar (padrão true) */
  stickyHeader?: boolean;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  title,
  maxHeight = 350,
  minWidth = 650,
  stickyHeader = true,
}) => {
  // Infere colunas a partir de `data` caso não tenha sido fornecido
  const cols: Column[] = React.useMemo(() => {
    if (columns?.length) return columns;
    if (!data.length) return [];
    return Object.keys(data[0]).map((key) => ({
      field: key,
      headerName: key,
      align: 'left',
    }));
  }, [columns, data]);

  return (
    <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', backgroundImage: 'none' }}> {/* backgroundImage: 'none' to ensure paper color is applied */}
      {title && (
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', flex: '0 0 auto' }}> {/* Use theme divider color */}
          <Typography variant='h6' sx={{color: 'text.primary'}}>{title}</Typography> {/* Ensure title uses primary text color */}
        </Box>
      )}
      <TableContainer sx={{ maxHeight, flex: '1 1 auto' }}>
        <MuiTable stickyHeader={stickyHeader} sx={{ minWidth }}>
          <TableHead>
            {/* TableHead styling is primarily handled by theme overrides (MuiTableHead) */}
            <TableRow>
              {cols.map((col) => (
                <TableCell
                  key={col.field}
                  align={col.align}
                  sx={{ width: col.width }} // Use sx for consistency if preferred
                >
                  {col.headerName ?? col.field}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow 
                hover 
                key={idx} 
                sx={{ 
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'action.hover', // Subtle striping for rows, uses theme's hover color
                  },
                  '&:last-child td, &:last-child th': { 
                    border: 0 // Remove border for the last row
                  } 
                }}
              >
                {cols.map((col) => {
                  const value = row[col.field];
                  return (
                    <TableCell
                      key={col.field}
                      align={col.align}
                      sx={{ width: col.width, color: 'text.secondary' }} // Use secondary text color for body cells for less emphasis
                    >
                      {col.render ? col.render(value, row) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Paper>
  );
};
export default Table;
