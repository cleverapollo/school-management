import { FieldValues } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  RHFAutocomplete,
  RHFAutocompleteProps,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { UseQueryReturnType } from '@tyro/api';
import { useBlocksList } from '../../api/blocks-list';

export type CoreBlockOptions = UseQueryReturnType<typeof useBlocksList>[number];

type RHFClassGroupAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, CoreBlockOptions>,
  'options'
>;

type BlocksSelectAutocompleteProps = Omit<
  AutocompleteProps<CoreBlockOptions>,
  | 'optionIdKey'
  | 'optionTextKey'
  | 'getOptionLabel'
  | 'filterOptions'
  | 'renderAvatarTags'
  | 'renderAvatarOption'
  | 'renderAvatarAdornment'
>;

export const RHFBlocksSelectAutocomplete = <TField extends FieldValues>(
  props: RHFClassGroupAutocompleteProps<TField>
) => {
  const { t } = useTranslation(['common']);
  const { data: blocksData, isLoading } = useBlocksList({});

  // @ts-ignore
  return (
    <RHFAutocomplete<TField, CoreBlockOptions>
      label={t('common:block')}
      {...props}
      fullWidth
      optionIdKey="blockId"
      optionTextKey="name"
      loading={isLoading}
      options={blocksData ?? []}
    />
  );
};

export const BlocksSelectAutocomplete = (
  props: BlocksSelectAutocompleteProps
) => {
  const { t } = useTranslation(['common']);
  const { data: blocksData, isLoading } = useBlocksList({});

  // @ts-ignore
  return (
    <Autocomplete
      label={t('common:class')}
      fullWidth
      optionIdKey="blockId"
      optionTextKey="name"
      loading={isLoading}
      options={blocksData ?? []}
    />
  );
};
