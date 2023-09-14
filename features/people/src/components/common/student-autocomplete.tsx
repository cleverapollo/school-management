import { FieldValues } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  RHFAutocomplete,
  RHFAutocompleteProps,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  StudentSelectOption,
  useStudentsForSelect,
} from '../../api/student/students';
import { usePeopleAutocompleteProps } from './use-people-autocomplete-props';

type RHFStudentAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, StudentSelectOption>,
  'options'
>;

type StudentAutocompleteProps = Omit<
  AutocompleteProps<StudentSelectOption>,
  'options'
>;

export const RHFStudentAutocomplete = <TField extends FieldValues>(
  props: RHFStudentAutocompleteProps<TField>
) => {
  const { t } = useTranslation(['common']);
  const { data: studentData, isLoading } = useStudentsForSelect({});
  const peopleAutocompleteProps =
    usePeopleAutocompleteProps<StudentSelectOption>();

  return (
    <RHFAutocomplete<TField, StudentSelectOption>
      label={t('common:student')}
      {...peopleAutocompleteProps}
      fullWidth
      loading={isLoading}
      options={studentData ?? []}
      {...props}
    />
  );
};

export const StudentAutocomplete = (props: StudentAutocompleteProps) => {
  const { t } = useTranslation(['common']);
  const { data: studentData, isLoading } = useStudentsForSelect({});
  const peopleAutocompleteProps =
    usePeopleAutocompleteProps<StudentSelectOption>();

  return (
    <Autocomplete
      label={t('common:student')}
      {...peopleAutocompleteProps}
      fullWidth
      optionIdKey="partyId"
      loading={isLoading}
      options={studentData ?? []}
      {...props}
    />
  );
};
