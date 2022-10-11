import {
  TableCell,
  TableRow,
  TableBody as MuiTableBody,
  Typography,
} from '@mui/material';
import { FC, ReactNode } from 'react';
import { v4 as uuid } from 'uuid';

interface ITableBodyProps {
  rows: string[][];
  components: ((value: string) => ReactNode)[];
}

const TableBody: FC<ITableBodyProps> = ({ rows, components }) => (
    <MuiTableBody>
      {rows.map((arr) => (
        <TableRow key={uuid()}>
          {arr.map((value, index) => components[index](value) ?
              (components[index](value)) :
              (<TableCell key={uuid()}>
                <Typography>
                  {value}
                </Typography>
              </TableCell>))}
        </TableRow>
      ))}
    </MuiTableBody>
  );

export default TableBody;
