import {
  TableCell,
  TableRow,
  TableHead,
  Typography,
  IconButton,
} from '@mui/material';
import { flexRender } from '@tanstack/react-table';
import { Table } from '@tanstack/table-core';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ColumnHidingButton from './ColumnHidingButton';
import { OPTIONS_COLUMN_NAME } from './constants';

interface ITableHeaderProps<TData> {
  table: Table<TData>;
  isRowSelectionNeeded?: boolean;
}

const TableHeader = <TData,>({ table, isRowSelectionNeeded }: ITableHeaderProps<TData>) => {

  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} sx={{ boxShadow: 'inset 0px -1px 0px rgba(145, 158, 171, 0.24)' }}>
            {headerGroup.headers.map((header, index) => (
                header.column.columnDef.header !== 'id' && 
                <TableCell
                  colSpan={header.colSpan}
                  key={header.id}
                >
                  {(header.column.columnDef.header !== OPTIONS_COLUMN_NAME) ? 
                  <Typography>
                    {isRowSelectionNeeded && index === 0 && 
                      <input
                        style={{ marginRight: '20px' }}
                        type="checkbox" 
                        checked={table.getIsAllRowsSelected()} 
                        onChange={table.getToggleAllRowsSelectedHandler()}
                      />
                    }
                    <strong>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    </strong>
                    {header.column.getCanSort() && <IconButton onClick={header.column.getToggleSortingHandler()}>
                      <ArrowDownwardIcon />
                    </IconButton>}
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
