import { FieldValues } from 'react-hook-form';
import {
  RHFAutocomplete,
  RHFAutocompleteProps,
  usePreferredNameLayout,
} from '@tyro/core';
import { UseQueryReturnType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useStaffForSelect } from '../../api/staff';
import { usePeopleAutocompleteProps } from './use-people-autocomplete-props';

type StaffSelectOption = UseQueryReturnType<typeof useStaffForSelect>[number];

type StaffPostsAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, StaffSelectOption>,
  'options'
>;

export const StaffAutocomplete = <TField extends FieldValues>(
  props: StaffPostsAutocompleteProps<TField>
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
