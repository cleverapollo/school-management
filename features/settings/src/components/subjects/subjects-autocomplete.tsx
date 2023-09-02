import { FieldValues } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  RHFAutocomplete,
  RHFAutocompleteProps,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { useCatalogueSubjects } from '../../api/subjects';

export interface SubjectSelect {
  subjectId: number;
  name: string;
}

type RHFYearGroupAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, SubjectSelect>,
  'options'
>;

type SubjectAutocompleteProps = Omit<
  AutocompleteProps<SubjectSelect>,
  | 'optionIdKey'
  | 'optionTextKey'
  | 'getOptionLabel'
  | 'filterOptions'
  | 'renderAvatarTags'
  | 'renderAvatarOption'
  | 'renderAvatarAdornment'
>;

export const RHFSubjectAutocomplete = <TField extends FieldValues>(
  props: RHFYearGroupAutocompleteProps<TField>
) => {
  const { t } = useTranslation(['common']);
  const { data: subjectsData, isLoading } = useCatalogueSubjects();

  const subjectOptions = useMemo(
    () =>
      subjectsData?.map((r) => ({
        subjectId: r.id,
        name: r.name,
      })),
    [subjectsData]
  );

  // @ts-ignore
  return (
    <RHFAutocomplete<TField, SubjectSelect>
      label={t('common:subject')}
      {...props}
      fullWidth
      optionIdKey="subjectId"
      optionTextKey="name"
      loading={isLoading}
      options={subjectOptions ?? []}
    />
  );
};

export const SubjectAutocomplete = (props: SubjectAutocompleteProps) => {
  const { t } = useTranslation(['common']);
  const { data: subjectsData, isLoading } = useCatalogueSubjects();

  const subjectOptions = useMemo(
    () =>
      subjectsData?.map((r) => ({
        subjectId: r.id,
        name: r.name,
      })),
    [subjectsData]
  );
  // @ts-ignore
  return (
    <Autocomplete
      label={t('common:year')}
      fullWidth
      optionIdKey="subjectId"
      optionTextKey="name"
      loading={isLoading}
      options={subjectOptions ?? []}
    />
  );
};
