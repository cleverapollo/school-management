import { FieldValues } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  RHFAutocomplete,
  RHFAutocompleteProps,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import {
  CatalogueSubjectOption,
  useCatalogueSubjects,
} from '../../api/subjects';

type RHFYearGroupAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, CatalogueSubjectOption>,
  'options'
>;

type SubjectAutocompleteProps = Omit<
  AutocompleteProps<CatalogueSubjectOption>,
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


  // @ts-ignore
  return (
    <RHFAutocomplete<TField, CatalogueSubjectOption>
      label={t('common:subject')}
      {...props}
      fullWidth
      optionIdKey="id"
      optionTextKey="name"
      getOptionLabel={(option) => `${option.name} (${option?.nationalCode ?? "-"})`}
      loading={isLoading}
      options={subjectsData ?? []}
    />
  );
};

export const SubjectAutocomplete = (props: SubjectAutocompleteProps) => {
  const { t } = useTranslation(['common']);
  const { data: subjectsData, isLoading } = useCatalogueSubjects();

  // @ts-ignore
  return (
    <Autocomplete
      label={t('common:year')}
      fullWidth
      optionIdKey="id"
      getOptionLabel={(option) => `${option.name} (${option?.nationalCode ?? "-"})`}
      loading={isLoading}
      options={subjectsData ?? []}
    />
  );
};
