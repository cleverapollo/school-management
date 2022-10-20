import { Typography, TextField, InputAdornment, SvgIcon } from '@mui/material';
import { Table } from '@tanstack/table-core';
import { Dispatch, SetStateAction, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import { Box } from '@mui/material';
import { TableColumn } from './types';
import Filter from './Filter';

interface ITableToolbarProps<TData> {
  title: string;
  table: Table<TData>;
  columnsWithPermissions: TableColumn<TData>[];
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
}

const TableToolbar = <TData,>({ table, title, columnsWithPermissions, globalFilter, setGlobalFilter }: ITableToolbarProps<TData>) => {

  const [showFilters, setShowFilters] = useState<boolean>(false);

  return (<Box sx={{ paddingY: '10px' }}>
    <Typography variant="h4">{title}</Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginX: '30px', paddingY: '24px' }}>
      <TextField
        value={globalFilter ?? ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        variant="outlined"
        sx={{ width: '32%' }}
        InputProps={{
          startAdornment: <InputAdornment position="start">
            <SvgIcon component={SearchIcon} />
          </InputAdornment>,
        }}
      />
      <Box onClick={() => setShowFilters(!showFilters)} sx={{ display: 'flex', alignItems: 'center' }}>
        <SvgIcon component={FilterIcon} style={{ marginRight: '10px' }}/>
        Filters
      </Box>
    </Box>
    {showFilters && table.getHeaderGroups().map((headerGroup) => (
      <Box key={headerGroup.id} sx={{ display: 'flex', flexWrap: 'wrap', padding: '0 14px 0 24px' }}>
        {headerGroup.headers.map((header) => (
          <Box key={header.id} sx={{ margin: '0 20px 20px 0' }}>
            <Filter 
              column={header.column} 
              type={columnsWithPermissions.find((item) => 
                item.columnDisplayName === header.column.columnDef.header?.toString())?.filter} 
            />
          </Box>
        ))}
      </Box>
    ))}
  </Box>);
}
  
export default TableToolbar;
  