import {
  TableCell,
  TableRow,
  TableHead,
  Typography,
} from '@mui/material';
import { flexRender } from '@tanstack/react-table';
import { Table } from '@tanstack/table-core';
import ColumnHidingButton from './ColumnHidingButton';
import { OPTIONS_COLUMN_NAME } from './constants';

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
                  {header.column.columnDef.header !== OPTIONS_COLUMN_NAME ? 
                  <Typography>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Typography> : 
                  <ColumnHidingButton columns={table.getAllLeafColumns()}/>
                  }
                </TableCell>
              ))}
          </TableRow>
        ))}
    </TableHead>
  );
}

export default TableHeader;
