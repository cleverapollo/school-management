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
>;

type YearGroupAutocompleteProps = Omit<
  AutocompleteProps<YearGroupSelect>,
  | 'optionIdKey'
  | 'optionTextKey'
  | 'getOptionLabel'
  | 'filterOptions'
  | 'renderAvatarTags'
  | 'renderAvatarOption'
  | 'renderAvatarAdornment'
>;

export const RHFYearGroupAutocomplete = <TField extends FieldValues>(
  props: RHFYearGroupAutocompleteProps<TField>
) => {
  const { t } = useTranslation(['common']);
  const { data: yearGroupData, isLoading } = useYearGroups();

  const yearGroupOptions = useMemo(
    () =>
      yearGroupData?.map((yg) => ({
        partyId: yg.yearGroupEnrollmentPartyId,
        name: yg.name,
      })),
    [yearGroupData]
  );

  // @ts-ignore
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
      yearGroupData?.map((yg) => ({
        partyId: yg.yearGroupEnrollmentPartyId,
        name: yg.name,
      })),
    [yearGroupData]
  );
  // @ts-ignore
  return (
    <Autocomplete
      label={t('common:year')}
      fullWidth
      optionIdKey="partyId"
      optionTextKey="name"
      loading={isLoading}
      options={yearGroupOptions ?? []}
    />
  );
};
