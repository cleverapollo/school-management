import {
  TableCell,
  TableRow,
  TableHead,
  Typography,
} from '@mui/material';
import { flexRender } from '@tanstack/react-table';
import { Table } from '@tanstack/table-core';
import { FC } from 'react';
import { v4 as uuid } from 'uuid';

interface ITableHeaderProps<TData> {
  table: Table<TData>;
}

// interface ITableHeaderProps {
//   columnHeaders: string[];
// }

// const TableHeader: FC<ITableHeaderProps> = ({ columnHeaders }) => (
//     <TableHead>
//       <TableRow>
//         {columnHeaders.map(header => (
//           <TableCell key={uuid()}>
//             <Typography>
//               {header}
//             </Typography>
//           </TableCell>
//           )
//         )}
//       </TableRow>
//     </TableHead>
//   );

const TableHeader = <TData,>({ table }: ITableHeaderProps<TData>) => {
  const rowModel = table.getRowModel();

  return (
    <TableHead>
      {table.getHeaderGroups().map((headerGroup) => {
        return (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
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
              );
            })}
          </TableRow>
        );
      })}
    </TableHead>
  );
}

export default TableHeader;
