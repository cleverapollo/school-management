import {
  TableCell,
  TableRow,
  TableHead,
  Typography,
} from '@mui/material';
import { flexRender, Table } from '@tanstack/react-table';
import ColumnHidingButton from './ColumnHidingButton';
import { OPTIONS_COLUMN_NAME } from './constants';

interface ITableHeaderProps<TData> {
  table: Table<TData>;
}

const TableHeader = <TData,>({ table }: ITableHeaderProps<TData>) => {

  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} sx={{ boxShadow: 'inset 0px -1px 0px rgba(145, 158, 171, 0.24)' }}>
            {headerGroup.headers.map((header) => (
                <TableCell
                  colSpan={header.colSpan}
                  key={header.id}
                >
                  {header.column.columnDef.header !== OPTIONS_COLUMN_NAME ? 
                  <Typography>
                    <strong>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    </strong>
                  </Typography> : 
                  <ColumnHidingButton columns={table.getAllLeafColumns()}
                  />
                  }
                </TableCell>
              ))}
          </TableRow>
        ))}
    </thead>
  );
}

export default TableHeader;
