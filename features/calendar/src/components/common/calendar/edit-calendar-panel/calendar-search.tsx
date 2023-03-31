import { Dispatch, SetStateAction, useId } from 'react';
import {
  Autocomplete,
  Box,
  Chip,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Avatar, useDebouncedValue } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { getColorBasedOnIndex, Search } from '@tyro/api';
import { useCalendarSearch } from '../../../../api/calendar-search';

export type CalendarParty = Pick<
  Search,
  'partyId' | 'text' | 'type' | 'avatarUrl'
>;

export interface CalendarSearchProps {
  selectedPartys: CalendarParty[];
  onChangeSelectedPartys: Dispatch<SetStateAction<CalendarParty[]>>;
}

export function CalendarSearch({
  selectedPartys,
  onChangeSelectedPartys,
}: CalendarSearchProps) {
  const id = useId();
  const { t } = useTranslation(['common']);
  const {
    setValue: setSearchValue,
    value: searchValue,
    debouncedValue: debouncedSearchValue,
  } = useDebouncedValue({
    defaultValue: '',
  });

  const { data, isLoading } = useCalendarSearch(debouncedSearchValue);

  return (
    <Box>
      <FormLabel htmlFor={id}>Calendars</FormLabel>
      <Autocomplete
        multiple
        id={id}
        options={data ?? []}
        loading={isLoading}
        value={selectedPartys}
        onChange={(_, options) => onChangeSelectedPartys(options)}
        getOptionLabel={(option) => option.text}
        filterSelectedOptions
        open={searchValue.length > 0}
        inputValue={searchValue}
        onInputChange={(_, newInputValue) => {
          setSearchValue(newInputValue);
        }}
        isOptionEqualToValue={(option, value) =>
          option.partyId === value.partyId
        }
        popupIcon={null}
        ListboxProps={{
          sx: {
            '& .MuiAutocomplete-option': {
              p: 1,
            },
          },
        }}
        renderOption={(props, option) => (
          <Stack component="li" direction="row" spacing={1} {...props}>
            <Avatar
              name={option.text}
              src={option.avatarUrl ?? undefined}
              sx={{ width: 32, height: 32, fontSize: '0.75rem' }}
            />
            <Stack>
              <Typography variant="subtitle2">{option.text}</Typography>
              <Typography variant="caption">
                {t(`common:searchType.${option.type}`)}
              </Typography>
            </Stack>
          </Stack>
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              avatar={
                <Avatar
                  name={option.text}
                  src={option.avatarUrl ?? undefined}
                />
              }
              variant="soft"
              color={getColorBasedOnIndex(index)}
              label={option.text}
              size="small"
              {...getTagProps({ index })}
            />
          ))
        }
        ChipProps={{ size: 'small' }}
        renderInput={(params) => (
          <TextField
            {...params}
            hiddenLabel
            variant="filled"
            placeholder="People, groups, rooms, etc"
            size="small"
            fullWidth
          />
        )}
      />
    </Box>
  );
}
