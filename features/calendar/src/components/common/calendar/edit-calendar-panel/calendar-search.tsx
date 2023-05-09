import { Dispatch, SetStateAction, useId } from 'react';
import { Box, FormLabel } from '@mui/material';
import { Autocomplete } from '@tyro/core';
import {
  CalendarParty,
  useParticipantsSearchProps,
} from '../../../../hooks/use-participants-search-props';

export interface CalendarSearchProps {
  selectedPartys: CalendarParty[];
  onChangeSelectedPartys: Dispatch<SetStateAction<CalendarParty[]>>;
}

export function CalendarSearch({
  selectedPartys,
  onChangeSelectedPartys,
}: CalendarSearchProps) {
  const id = useId();
  const participantsProps = useParticipantsSearchProps({
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
      <FormLabel htmlFor={id}>Calendars</FormLabel>
      <Autocomplete<CalendarParty, true> {...participantsProps} />
    </Box>
  );
}
