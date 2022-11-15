import { Typography, TextField, InputAdornment, SvgIcon } from '@mui/material';
import { Table } from '@tanstack/table-core';
import { Dispatch, SetStateAction, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import { Box } from '@mui/material';
import { TableColumn } from './types';
import Filter from './Filter';
import { capitalize, isEmpty } from 'lodash';
import useLocales from '../../hooks/useLocales';

interface ITableToolbarProps<TData> {
  title: string;
  story?: string[];
  //table: Table<TData>;
  //columnsWithPermissions: TableColumn<TData>[];
}

const TableToolbar = <TData,>({ title, story }: ITableToolbarProps<TData>) => {
  return (<Box sx={{ marginBottom: '16px' }}>
    <Typography variant="h4">{capitalize(title)}</Typography>
    {!isEmpty(story) && <Box sx={{ display: 'flex', margin: '8px 0 40px' }}>
      {story?.map((part, index) => 
        <Box key={part + index} sx={{ display: 'flex' }}>
          {part}
          {index !== story.length - 1 && <img src="/assets/dot.svg" style={{ margin: '0 16px' }}/>}
        </Box>)
      }
    </Box>}
  </Box>);
}
  
export default TableToolbar;
  