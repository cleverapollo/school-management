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
  table: Table<TData>;
  columnsWithPermissions: TableColumn<TData>[];
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
}

const TableFilters = <TData,>({ table, columnsWithPermissions, globalFilter, setGlobalFilter }: ITableToolbarProps<TData>) => {

  const { translate } = useLocales();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  return (<Box sx={{ paddingX: '10px' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginY: '30px', paddingRight: '14px' }}>
      <TextField
        value={globalFilter ?? ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder={translate('search') + '...'}
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
          {translate('filters')}
      </Box>
    </Box>
    {showFilters && table.getHeaderGroups().map((headerGroup) => (
      <Box key={headerGroup.id} sx={{ display: 'flex', flexWrap: 'wrap', paddingRight: '14px' }}>
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
  
export default TableFilters;
  