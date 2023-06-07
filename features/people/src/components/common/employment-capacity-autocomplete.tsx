import { FieldValues } from 'react-hook-form';
import { RHFAutocomplete, RHFAutocompleteProps } from '@tyro/core';
import {
  useEmploymentCapacities,
  EmploymentCapacityOption,
} from '../../api/staff/employment-capacities';

type EmploymentCapacityAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, EmploymentCapacityOption>,
  'options'
>;

export const EmploymentCapacityAutocomplete = <TField extends FieldValues>(
  props: EmploymentCapacityAutocompleteProps<TField>
) => {
  const { data: capacitiesData = [] } = useEmploymentCapacities();

  return (
    <RHFAutocomplete<TField, EmploymentCapacityOption>
      optionIdKey="id"
      optionTextKey="name"
      fullWidth
      options={capacitiesData}
      {...props}
    />
  );
};
