import {
  TableCell,
  TableRow,
  TableBody as MuiTableBody,
  Typography,
} from '@mui/material';
import { flexRender } from '@tanstack/react-table';
import { Table } from '@tanstack/table-core';
import { FC, Fragment, ReactNode } from 'react';
import { v4 as uuid } from 'uuid';

interface ITableBodyProps<TData> {
  table: Table<TData>;
}

// interface ITableBodyProps {
//   rows: string[][];
//   components: ((value: string) => ReactNode)[];
// }

// const TableBody: FC<ITableBodyProps> = ({ rows, components }) => (
//     <MuiTableBody>
//       {rows.map((arr) => (
//         <TableRow key={uuid()}>
//           {arr.map((value, index) => components[index](value) ?
//               (components[index](value)) :
//               (<TableCell key={uuid()}>
//                 <Typography>
//                   {value}
//                 </Typography>
//               </TableCell>))}
//         </TableRow>
//       ))}
//     </MuiTableBody>
//   );
const TableBody = <TData,>({ table }: ITableBodyProps<TData>) => {
  const rowModel = table.getRowModel();

  return (<MuiTableBody>
      {rowModel.rows.map((row) => (
        <Fragment key={row.id}>
          <TableRow>
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
