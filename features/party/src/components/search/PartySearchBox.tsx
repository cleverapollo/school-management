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
import { AutocompleteInputChangeReason } from '@mui/base/AutocompleteUnstyled/useAutocomplete';
import { PartyOption, usePartySearch } from '../../api/search';

type DefaultAutoCompleteProps = AutocompleteProps<
  PartyOption,
  boolean,
  boolean,
  boolean
>;

interface PartySearchBoxProps {
  filterPartyTypes?: PartyType[];
  label: string;
  onPartySelected?: (party: PartyOption) => void;
  sx?: DefaultAutoCompleteProps['sx'];
  onChange?: DefaultAutoCompleteProps['onChange'];
}

export function PartySearchBox({
  filterPartyTypes,
  sx,
  label,
  onPartySelected,
  ...props
}: PartySearchBoxProps) {
  const { setValue, value, debouncedValue } = useDebouncedValue({
    defaultValue: '',
  });
  const { data, isLoading } = usePartySearch({
    partyIds: [],
    nameFuzzySearch: debouncedValue,
    filterPartyTypes,
  } as PartyFilter);

  if (isLoading) {
    return null;
  }
  const groupBy =
    filterPartyTypes == null || filterPartyTypes.length === 1
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
      onInputChange={(event, newInputValue) => {
        setValue(newInputValue);
      }}
      sx={{ width: 300, ...sx }}
      renderInput={(params) => <TextField {...params} label={label} />}
      renderGroup={(params) => (
        <li key={params.key}>
          <div>{params.group}</div>
          <div>{params.children}</div>
        </li>
      )}
      {...props}
    />
  );
}
