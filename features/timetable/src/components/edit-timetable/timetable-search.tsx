import { Dispatch, SetStateAction, useId } from 'react';
import { Autocomplete, AutocompleteProps } from '@tyro/core';
import { useCalendarSearchProps, CalendarParty } from '@tyro/calendar';
import { useTranslation } from '@tyro/i18n';

export interface TimetableSearchProps
  extends Partial<AutocompleteProps<CalendarParty, true>> {
  selectedPartys: CalendarParty[];
  onChangeSelectedPartys: Dispatch<SetStateAction<CalendarParty[]>>;
}

export function TimetableSearch({
  selectedPartys,
  onChangeSelectedPartys,
}: TimetableSearchProps) {
  const id = useId();
  const { t } = useTranslation(['timetable']);
  const participantsProps = useCalendarSearchProps({
    id,
    label: t('timetable:timetables'),
    value: selectedPartys,
    ListboxProps: {
      sx: {
        '& .MuiAutocomplete-option': {
          p: 1,
        },
      },
    },
    inputProps: {
      variant: 'white-filled',
      fullWidth: true,
    },
    onChange: (_, options) =>
      onChangeSelectedPartys((options as CalendarParty[]) ?? []),
    sx: {
      flex: 1,
      maxWidth: 600,
    },
  });

  return <Autocomplete<CalendarParty, true> {...participantsProps} />;
}
