import {
  TableCell,
  TableRow,
  TableBody as MuiTableBody,
  Typography,
} from '@mui/material';
import { flexRender } from '@tanstack/react-table';
import { Table } from '@tanstack/table-core';
import { Fragment } from 'react';

interface ITableBodyProps<TData> {
  table: Table<TData>;
}

const TableBody = <TData,>({ table }: ITableBodyProps<TData>) => {
  const rowModel = table.getRowModel();

  return (<MuiTableBody>
      {rowModel.rows.map((row) => (
        <Fragment key={row.id}>
          <TableRow hover>
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
