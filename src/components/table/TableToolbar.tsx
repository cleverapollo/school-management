import { Typography, TextField, Autocomplete, Input, Button } from '@mui/material';
import { Box } from '@mui/system';
import { flexRender } from '@tanstack/react-table';
import { Table, Column } from '@tanstack/table-core';
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { FilterVariant, TableColumn } from './types';

interface ITableToolbarProps<TData> {
  title: string;
  table: Table<TData>;
  columnsWithPermissions: TableColumn<TData>[];
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
}

const TableToolbar = <TData,>({ table, title, columnsWithPermissions, globalFilter, setGlobalFilter }: ITableToolbarProps<TData>) => {
    function Filter({
      column,
      type,
    }: {
      column: Column<any, unknown>
      type: FilterVariant | undefined;
    }) {
      const columnFilterValue = column.getFilterValue();
      const createFormattedStringForDayjs = (value: string): string => {
        const arr = value.split('.');
        if(arr.length !== 3) {
          return value;
        }
        return `${arr[1]}.${arr[0]}.${arr[2]}`;
      }
      const initialValue = useMemo(() => (dayjs(columnFilterValue as string).format('DD.MM.YYYY') != 'Invalid Date' && columnFilterValue) ? dayjs(createFormattedStringForDayjs(columnFilterValue as string)) : null, []);
      const [value, setValue] = useState<Dayjs | null>(initialValue);
    
      const sortedUniqueValues = Array.from(column.getFacetedUniqueValues().keys()).sort();
    
      switch(type) {
        case 'date': return (<Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              inputFormat='DD/MM/YYYY'
              label={column.columnDef.header?.toString()}
              value={value}
              onChange={(newValue) => {        
                if(newValue?.format('DD.MM.YYYY') != 'Invalid Date' && newValue) {
                console.log('newValue in onChange - ', newValue);
                column.setFilterValue(newValue?.format('DD.MM.YYYY') || '');
              } 
              if(!newValue) { column.setFilterValue(''); }
              setValue(newValue); }}
              renderInput={(params) => <TextField {...params}/>}
            />
          </LocalizationProvider>
        </Box>)
        case 'suggest': return (<Box>
          <Autocomplete
            id={column.id + 'list'}
            options={sortedUniqueValues}
            sx={{ width: 250 }}
            onChange={(e, newValue) => column.setFilterValue(newValue || '')}
            value={(columnFilterValue) as string}
            renderInput={(params) => <TextField {...params} label={column.columnDef.header?.toString()} />}
          />
        </Box>
      )
        default: return null;
      }
    }

  const [showFilters, setShowFilters] = useState<boolean>(false);

  return (<>
    <Typography variant="h3">{title}</Typography>
    <div style={{display: 'flex', justifyContent:'space-between', margin: '30px 0'}}>
      <TextField
        value={globalFilter ?? ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        variant="outlined"
      />
      <Button onClick={() => setShowFilters(!showFilters)}>
        Filters
      </Button>
    </div>
    {showFilters && table.getHeaderGroups().map((headerGroup) => (
          <div key={headerGroup.id} style={{display: 'flex', flexWrap: 'wrap'}}>
            {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  style={{margin: '0 20px 20px 0'}}
                >
                  <Filter column={header.column} type={columnsWithPermissions.find(item => item.columnDisplayName === header.column.columnDef.header?.toString())?.filter} />
                </div>
              ))}
          </div>
        ))}
  </>);
}
  
export default TableToolbar;
  