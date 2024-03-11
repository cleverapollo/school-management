import { AutocompleteProps, Autocomplete } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  ReturnTypeFromUseOptionsAvailableEnrollmentGroups,
  useOptionsAvailableEnrollmentGroups,
} from '../../api/options-enrolment-groups';

type OptionsYearSelectProps = Omit<
  AutocompleteProps<ReturnTypeFromUseOptionsAvailableEnrollmentGroups>,
  'options'
>;

export const OptionsYearAutocomplete = (props: OptionsYearSelectProps) => {
  const { t } = useTranslation(['common']);
  const { data: yearGroups, isLoading } = useOptionsAvailableEnrollmentGroups(
    {}
  );

  return (
    <Autocomplete
      label={t('common:years')}
      limitTags={1}
      fullWidth
      multiple
      inputProps={{
        variant: 'white-filled',
      }}
      sx={{
        maxWidth: 320,
        '& .MuiInputBase-root': {
          border: '1px solid',
          borderColor: 'indigo.50',
        },
      }}
      ChipProps={{
        size: 'small',
        variant: 'soft',
        color: 'primary',
      }}
      loading={isLoading}
      options={yearGroups ?? []}
      optionIdKey="id"
      optionTextKey="name"
      {...props}
    />
  );
};
