import {
  TableCell,
  TableRow,
  TableHead,
  Typography,
} from '@mui/material';
import { flexRender } from '@tanstack/react-table';
import { Table } from '@tanstack/table-core';

interface ITableHeaderProps<TData> {
  table: Table<TData>;
}

const TableHeader = <TData,>({ table }: ITableHeaderProps<TData>) => {

  return (
    <TableHead>
      {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
                <TableCell
                  colSpan={header.colSpan}
                  key={header.id}
                >
                  <Typography>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Typography>
                </TableCell>
              ))}
          </TableRow>
        ))}
    </TableHead>
  );
}

export default TableHeader;
