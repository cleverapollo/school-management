import { Typography, TextField, InputAdornment, SvgIcon } from '@mui/material';
import { Table } from '@tanstack/table-core';
import { Dispatch, SetStateAction, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import { Box } from '@mui/material';
import { TableColumn } from './types';
import Filter from './Filter';
import { capitalize } from 'lodash';
import useLocales from '../../hooks/useLocales';

interface ITableToolbarProps<TData> {
  title: string;
  //table: Table<TData>;
  //columnsWithPermissions: TableColumn<TData>[];
}

const TableToolbar = <TData,>({ title }: ITableToolbarProps<TData>) => {
  return (<Box sx={{ marginBottom: '16px' }}>
    <Typography variant="h4">{capitalize(title)}</Typography>
  </Box>);
}
  
export default TableToolbar;
  