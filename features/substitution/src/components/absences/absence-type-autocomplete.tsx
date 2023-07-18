import { FieldValues } from 'react-hook-form';
import { RHFAutocomplete, RHFAutocompleteProps } from '@tyro/core';
import { UseQueryReturnType } from '@tyro/api';
import { useStaffWorkAbsenceTypes } from '../../api/staff-work-absence-types';

export type StaffWorkAbsenceTypeOption = UseQueryReturnType<
  typeof useStaffWorkAbsenceTypes
>[number];

type StaffWorkAbsenceTypeAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, StaffWorkAbsenceTypeOption>,
  'options'
>;

export const AbsenceTypeAutoComplete = <TField extends FieldValues>(
  props: StaffWorkAbsenceTypeAutocompleteProps<TField>
) => {
  const { data: absenceTypesData, isLoading } = useStaffWorkAbsenceTypes({});

  return (
    <RHFAutocomplete<TField, StaffWorkAbsenceTypeOption>
      optionIdKey="absenceTypeId"
      options={absenceTypesData ?? []}
      loading={isLoading}
      optionTextKey="name"
      fullWidth
      {...props}
    />
  );
};
