import { FieldValues } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  RHFAutocomplete,
  RHFAutocompleteProps,
} from '@tyro/core';
import { UseQueryReturnType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useStaffForSelect } from '../../api/staff';
import { usePeopleAutocompleteProps } from './use-people-autocomplete-props';

export type StaffSelectOption = UseQueryReturnType<
  typeof useStaffForSelect
>[number];

type RHFStaffAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, StaffSelectOption>,
  'options'
>;

type StaffAutocompleteProps = Omit<
  AutocompleteProps<StaffSelectOption>,
  'options'
>;

export const RHFStaffAutocomplete = <TField extends FieldValues>(
  props: RHFStaffAutocompleteProps<TField>
) => {
  const { t } = useTranslation(['common']);
  const { data: teacherData, isLoading } = useStaffForSelect({});
  const peopleAutocompleteProps =
    usePeopleAutocompleteProps<StaffSelectOption>();

  return (
    <RHFAutocomplete<TField, StaffSelectOption>
      label={t('common:staffMember')}
      {...peopleAutocompleteProps}
      fullWidth
      loading={isLoading}
      options={teacherData ?? []}
      {...props}
    />
  );
};

export const StaffAutocomplete = (props: StaffAutocompleteProps) => {
  const { t } = useTranslation(['common']);
  const { data: teacherData, isLoading } = useStaffForSelect({});
  const peopleAutocompleteProps =
    usePeopleAutocompleteProps<StaffSelectOption>();

  return (
    <Autocomplete
      label={t('common:staffMember')}
      {...peopleAutocompleteProps}
      fullWidth
      loading={isLoading}
      options={teacherData ?? []}
      {...props}
    />
  );
};
