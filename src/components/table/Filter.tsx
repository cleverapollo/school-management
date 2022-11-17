import { FC, useMemo, useState } from "react";
import { Column } from '@tanstack/react-table';
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Autocomplete, TextField } from "@mui/material";
import { Box } from '@mui/system';
import { FilterVariant } from "./types";
import { createFormattedStringForDayjs } from "../../utils/table";
import { DEFAULT_DATE_FORMAT, DISPLAYED_DATE_FORMAT, FORMATTED_ERROR_TEXT } from "./constants";

interface FilterProps {
  column: Column<any, unknown>;
  type: FilterVariant | undefined;
}

const Filter: FC<FilterProps> = ({ column, type }) => {
  const columnFilterValue = column.getFilterValue();
  const initialValue = useMemo(() => (
    dayjs(columnFilterValue as string).format(DEFAULT_DATE_FORMAT) != FORMATTED_ERROR_TEXT && columnFilterValue) ? 
      dayjs(createFormattedStringForDayjs(columnFilterValue as string)) 
      : null, []);
  const [value, setValue] = useState<Dayjs | null>(initialValue);
  
  const sortedUniqueValues = Array.from(column.getFacetedUniqueValues().keys()).sort();
  
  switch(type) {
    case 'date': return (<Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          inputFormat={DISPLAYED_DATE_FORMAT}
          label={column.columnDef.header?.toString()}
          value={value}
          onChange={(newValue) => {        
            if(newValue?.format(DEFAULT_DATE_FORMAT) != FORMATTED_ERROR_TEXT && newValue) {
              column.setFilterValue(newValue?.format(DEFAULT_DATE_FORMAT) || '');
            } 
            if(!newValue) { 
              column.setFilterValue(''); 
            }
            setValue(newValue); 
          }}
          renderInput={(params) => <TextField sx={{ width: 210 }} {...params}/>}
        />
      </LocalizationProvider>
    </Box>);

    case 'suggest': return (<Box>
      <Autocomplete
        id={column.id + 'list'}
        options={sortedUniqueValues}
        sx={{ width: 210 }}
        onChange={(e, newValue) => column.setFilterValue(newValue || '')}
        value={(columnFilterValue) as string}
        renderInput={(params) => <TextField {...params} label={column.columnDef.header?.toString()} />}
      />
    </Box>);

    default: return null;
  }
}

export default Filter;
