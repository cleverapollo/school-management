import { FieldValues } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  RHFAutocomplete,
  RHFAutocompleteProps,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { useYearGroups } from '../../api/year-groups';

export interface YearGroupSelect {
  partyId: number;
  name: string;
}

type RHFYearGroupAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, YearGroupSelect>,
  'options'
> & { academicNamespaceId?: number };

type YearGroupAutocompleteProps = Omit<
  AutocompleteProps<YearGroupSelect>,
  | 'options'
  | 'optionIdKey'
  | 'optionTextKey'
  | 'getOptionLabel'
  | 'filterOptions'
  | 'renderAvatarTags'
  | 'renderAvatarOption'
  | 'renderAvatarAdornment'
>;

export const RHFYearGroupAutocomplete = <TField extends FieldValues>({
  academicNamespaceId,
  ...props
}: RHFYearGroupAutocompleteProps<TField>) => {
  const { t } = useTranslation(['common']);
  const { data: yearGroupData, isLoading } = useYearGroups({
    academicNamespaceIds: academicNamespaceId
      ? [academicNamespaceId]
      : undefined,
  });

  const yearGroupOptions = useMemo(
    () =>
      yearGroupData?.map(({ yearGroupEnrollmentPartyId, name }) => ({
        partyId: yearGroupEnrollmentPartyId,
        name,
      })),
    [yearGroupData]
  );

  return (
    <RHFAutocomplete<TField, YearGroupSelect>
      label={t('common:year')}
      {...props}
      fullWidth
      optionIdKey="partyId"
      optionTextKey="name"
      loading={isLoading}
      options={yearGroupOptions ?? []}
    />
  );
};

export const YearGroupAutocomplete = (props: YearGroupAutocompleteProps) => {
  const { t } = useTranslation(['common']);
  const { data: yearGroupData, isLoading } = useYearGroups();

  const yearGroupOptions = useMemo(
    () =>
      yearGroupData?.map(({ yearGroupEnrollmentPartyId, name }) => ({
        partyId: yearGroupEnrollmentPartyId,
        name,
      })),
    [yearGroupData]
  );

  return (
    <Autocomplete
      label={t('common:year')}
      fullWidth
      optionIdKey="partyId"
      optionTextKey="name"
      loading={isLoading}
      options={yearGroupOptions ?? []}
      {...props}
    />
  );
};
