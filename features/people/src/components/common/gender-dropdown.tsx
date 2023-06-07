import { FieldValues } from 'react-hook-form';
import { RHFSelect, RHFSelectProps } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

import { Gender } from '@tyro/api';

type GenderDropdownProps<TField extends FieldValues> = Omit<
  RHFSelectProps<TField, Gender>,
  'options' | 'getOptionLabel'
>;

const genderOptions = Object.values(Gender);

export const GenderDropdown = <TField extends FieldValues>(
  props: GenderDropdownProps<TField>
) => {
  const { t } = useTranslation(['people']);

  return (
    <RHFSelect<TField, Gender>
      fullWidth
      options={genderOptions}
      getOptionLabel={(option) => t(`people:gender.${option}`)}
      {...props}
    />
  );
};
