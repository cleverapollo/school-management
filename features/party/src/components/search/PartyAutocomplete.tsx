import {
  Autocomplete,
  AutocompleteProps,
  Box,
  BoxProps,
  TextField,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { PartyFilter, PartyType, StudentFilter } from '@tyro/api';
import { useDebouncedValue } from '@tyro/core';
import * as React from 'react';
import { PartyOption, usePartySearch } from '../../api/search';

type DefaultAutoCompleteProps = AutocompleteProps<
  PartyOption,
  boolean,
  boolean,
  boolean
>;

interface PartyAutocompleteProps {
  filterPartyTypes?: PartyType[];
  label: string;
  onPartySelected?: (party: PartyOption) => void;
  partyIds?: [number];
  limit?: number;
  sx?: DefaultAutoCompleteProps['sx'];
  onChange?: DefaultAutoCompleteProps['onChange'];
}

export function PartyAutocomplete({
  filterPartyTypes,
  sx,
  label,
  onPartySelected,
  limit,
  partyIds,
  ...props
}: PartyAutocompleteProps) {
  const { setValue, value, debouncedValue } = useDebouncedValue({
    defaultValue: '',
  });
  const { data, isLoading } = usePartySearch({
    partyIds: partyIds || [],
    nameFuzzySearch: debouncedValue,
    filterPartyTypes,
    limit: limit || 50,
  } as PartyFilter);

  if (isLoading) {
    return null;
  }
  const groupBy =
    filterPartyTypes != null && filterPartyTypes.length === 1
      ? undefined
      : (option: PartyOption) => option.partyType;
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      groupBy={groupBy}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      options={data as PartyOption[]}
      filterOptions={(x) => x}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      )}
      onInputChange={(event, newInputValue) => {
        setValue(newInputValue);
      }}
      sx={{ width: 300, ...sx }}
      renderInput={(params) => <TextField {...params} label={label} />}
      renderGroup={(params) => (
        <div key={params.key}>
          <div>{params.group}</div>
          <div>{params.children}</div>
        </div>
      )}
      {...props}
    />
  );
}
