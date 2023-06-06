import { useTranslation } from '@tyro/i18n';
import { Autocomplete } from '@tyro/core';
import { useEffect, useMemo } from 'react';
import { SxProps, Theme } from '@mui/material';
import { useYearGroups, ReturnTypeFromUseYearGroups } from '@tyro/groups';

type YearGroupsAutocompleteValue = ReturnTypeFromUseYearGroups;

export type YearGroupsAutocompleteProps = {
  value: YearGroupsAutocompleteValue | null;
  onChange: (yearGroup: YearGroupsAutocompleteValue | null) => void;
  sx?: SxProps<Theme> | undefined;
};

export const YearGroupsAutocomplete = ({
  value,
  onChange,
  sx,
}: YearGroupsAutocompleteProps) => {
  const { t } = useTranslation(['common']);
  const { data: years } = useYearGroups();

  const options = useMemo(
    () =>
      years?.sort((prev, next) => prev.name.localeCompare(next.name) ?? 0) ??
      [],
    [years]
  );

  useEffect(() => {
    if (!value && options.length) {
      onChange(options[0]);
    }
  }, [options]);

  return (
    <Autocomplete
      label={t('common:year')}
      value={value}
      options={options}
      isOptionEqualToValue={(option, { yearGroupEnrollmentPartyId }) =>
        option.yearGroupEnrollmentPartyId === yearGroupEnrollmentPartyId
      }
      getOptionLabel={({ name }) => name}
      onChange={(_event, newValue) => {
        const extractedValue = Array.isArray(newValue) ? newValue[0] : newValue;
        onChange(extractedValue);
      }}
      inputProps={{
        variant: 'white-filled',
      }}
      sx={sx}
    />
  );
};
