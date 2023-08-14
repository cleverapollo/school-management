import { FieldValues } from 'react-hook-form';
import { RHFSelect, RHFSelectProps } from '@tyro/core';

import {
  ReturnTypeFromUseSubstitutionTypes,
  useSubstitutionTypes,
} from '../../../api/staff-work-substitution-types';

type SubstitutionTypeDropdownProps<TField extends FieldValues> = Omit<
  RHFSelectProps<TField, ReturnTypeFromUseSubstitutionTypes[number]>,
  'options' | 'getOptionLabel'
>;

export const SubstitutionTypeDropdown = <TField extends FieldValues>(
  props: SubstitutionTypeDropdownProps<TField>
) => {
  const { data } = useSubstitutionTypes({});

  return (
    <RHFSelect<TField, ReturnTypeFromUseSubstitutionTypes[number]>
      fullWidth
      options={data ?? []}
      optionIdKey="substitutionTypeId"
      getOptionLabel={(option) => option.name}
      {...props}
    />
  );
};
