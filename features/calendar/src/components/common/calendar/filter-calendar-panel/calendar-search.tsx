import { Dispatch, SetStateAction, useId } from 'react';
import { Box, FormLabel } from '@mui/material';
import { Autocomplete, AutocompleteProps } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  CalendarParty,
  useCalendarSearchProps,
} from '../../../../hooks/use-calendar-search-props';

export interface CalendarSearchProps
  extends Partial<AutocompleteProps<CalendarParty, true>> {
  selectedPartys: CalendarParty[];
  onChangeSelectedPartys: Dispatch<SetStateAction<CalendarParty[]>>;
}

export function CalendarSearch({
  selectedPartys,
  onChangeSelectedPartys,
}: CalendarSearchProps) {
  const { t } = useTranslation(['common']);

  const id = useId();
  const participantsProps = useCalendarSearchProps({
    id,
    label: '',
    value: selectedPartys,
    ListboxProps: {
      sx: {
        '& .MuiAutocomplete-option': {
          p: 1,
        },
      },
    },
    inputProps: {
      variant: 'filled',
      hiddenLabel: true,
      fullWidth: true,
    },
    onChange: (_, options) =>
      onChangeSelectedPartys((options as CalendarParty[]) ?? []),
  });

  return (
    <Box>
      <FormLabel htmlFor={id}>{t('common:calendars')}</FormLabel>
      <Autocomplete<CalendarParty, true> {...participantsProps} />
    </Box>
  );
}
