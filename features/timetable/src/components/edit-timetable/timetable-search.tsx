import { Dispatch, SetStateAction, useId } from 'react';
import { Autocomplete, AutocompleteProps } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  useTimetableSearchProps,
  TimetableParty,
} from '../../hooks/use-timetable-search-props';

export interface TimetableSearchProps
  extends Partial<AutocompleteProps<TimetableParty, true>> {
  selectedPartys: TimetableParty[];
  onChangeSelectedPartys: Dispatch<SetStateAction<TimetableParty[]>>;
}

export function TimetableSearch({
  selectedPartys,
  onChangeSelectedPartys,
}: TimetableSearchProps) {
  const id = useId();
  const { t } = useTranslation(['timetable']);
  const participantsProps = useTimetableSearchProps({
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
      onChangeSelectedPartys((options as TimetableParty[]) ?? []),
    sx: {
      flex: 1,
      maxWidth: 600,
    },
  });

  return <Autocomplete<TimetableParty, true> {...participantsProps} />;
}
