import {
  TableCell,
  TableRow,
  TableBody as MuiTableBody,
  Typography,
} from '@mui/material';
import { flexRender, Table } from '@tanstack/react-table';
import { Fragment } from 'react';

interface ITableBodyProps<TData> {
  table: Table<TData>;
}

const TableBody = <TData,>({ table }: ITableBodyProps<TData>) => {
  const rowModel = table.getRowModel();

  return (<MuiTableBody>
      {rowModel.rows.map((row) => (
        <Fragment key={row.id}>
          <TableRow hover sx={{ boxShadow: 'inset 0px -1px 0px rgba(145, 158, 171, 0.24)' }}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
              >
                <Typography>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </Fragment>
      ))}
    </MuiTableBody>);
}

export default TableBody;
