import {
  TableCell,
  TableRow,
  TableHead,
  Typography,
} from '@mui/material';
import { FC } from 'react';
import { v4 as uuid } from 'uuid';

interface ITableHeaderProps {
  columnHeaders: string[];
}

const TableHeader: FC<ITableHeaderProps> = ({ columnHeaders }) => (
    <TableHead>
      <TableRow>
        {columnHeaders.map(header => (
          <TableCell key={uuid()}>
            <Typography>
              {header}
            </Typography>
          </TableCell>
          )
        )}
      </TableRow>
    </TableHead>
  );

export default TableHeader;
