import { Typography } from '@mui/material';
import { FC } from 'react';

interface ITableToolbarProps {
  title: string;
}

//ToDo: implement filters in toolbar
const TableToolbar: FC<ITableToolbarProps> = ({ title }) => (<Typography variant="h3">{title}</Typography>);
  
export default TableToolbar;
  