import {
  TableCell,
  TableRow,
  TableBody as MuiTableBody,
  Typography,
} from '@mui/material';
import { flexRender } from '@tanstack/react-table';
import { Table } from '@tanstack/table-core';
import { Fragment } from 'react';
import { checkIsColumnRenderNeeded } from '../../utils/table';
import { SYSTEM_HIDED_COLUMN_NAME } from './constants';

interface ITableBodyProps<TData> {
  table: Table<TData>;
  onClickRow?: (data: any) => void;
  isRowSelectionNeeded?: boolean;
}

const TableBody = <TData,>({ table, onClickRow, isRowSelectionNeeded }: ITableBodyProps<TData>) => {
  const rowModel = table.getRowModel();

  return (<MuiTableBody>
      {rowModel.rows.map((row) => (
        <Fragment key={row.id}>
          <TableRow 
            hover 
            sx={{ boxShadow: 'inset 0px -1px 0px rgba(145, 158, 171, 0.24)' }}
            onClick={() => onClickRow && 
              row.getAllCells().filter(cell => checkIsColumnRenderNeeded(cell.column.columnDef.header?.toString())).length && 
              onClickRow(row.getAllCells().find(cell => cell.column.columnDef.header?.toString() === SYSTEM_HIDED_COLUMN_NAME)?.getValue())
            }
          >
            {row.getVisibleCells().map((cell, index) => (
              checkIsColumnRenderNeeded(cell.column.columnDef.header?.toString()) &&
              <TableCell key={cell.id} sx={{ paddingLeft: '16px !important' }}>
                <Typography sx={{ display: 'flex' }}>
                  {isRowSelectionNeeded && index === 0 && 
                    <input
                      style={{ marginRight: '20px' }}
                      type="checkbox" 
                      checked={row.getIsSelected()} 
                      onChange={row.getToggleSelectedHandler()}
                    />
                  }
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
