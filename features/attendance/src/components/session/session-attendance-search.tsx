import { Dispatch, SetStateAction, useId } from 'react';
import { Autocomplete, AutocompleteProps } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  SessionParty,
  useSessionPartySearchProps,
} from '../../hooks/use-session-party-search-props';

export interface SessionAttendanceSearchProps
  extends Partial<AutocompleteProps<SessionParty, true>> {
  selectedPartys: SessionParty[];
  onChangeSelectedPartys: Dispatch<SetStateAction<SessionParty[]>>;
}

export function SessionAttendanceSearch({
  selectedPartys,
  onChangeSelectedPartys,
}: SessionAttendanceSearchProps) {
  const id = useId();
  const { t } = useTranslation(['common']);
  const participantsProps = useSessionPartySearchProps({
    id,
    label: t('common:search'),
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
      onChangeSelectedPartys((options as SessionParty[]) ?? []),
    sx: {
      flex: 1,
      maxWidth: 600,
    },
  });

  return <Autocomplete<SessionParty, true> {...participantsProps} />;
}
