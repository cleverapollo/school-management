import { FieldValues } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  RHFAutocomplete,
  RHFAutocompleteProps,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { useAllBlocksList } from '../../api/blocks-list';

export interface BlocksSelect {
  blockId: string;
  name: string;
}

type RHFClassGroupAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, BlocksSelect>,
  'options'
>;

type BlocksSelectAutocompleteProps = Omit<
  AutocompleteProps<BlocksSelect>,
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
  const { data: blocksData, isLoading } = useAllBlocksList();

  const blockOptions = useMemo(
    () =>
      blocksData?.map((yg) => ({
        blockId: yg.blockId,
        name: yg.name,
      })),
    [blocksData]
  );

  // @ts-ignore
  return (
    <RHFAutocomplete<TField, BlocksSelect>
      label={t('common:block')}
      {...props}
      fullWidth
      optionIdKey="blockId"
      optionTextKey="name"
      loading={isLoading}
      options={blockOptions ?? []}
    />
  );
};

export const BlocksSelectAutocomplete = (
  props: BlocksSelectAutocompleteProps
) => {
  const { t } = useTranslation(['common']);
  const { data: blocksData, isLoading } = useAllBlocksList();

  const blocksOptions = useMemo(
    () =>
      blocksData?.map((yg) => ({
        blockId: yg.blockId,
        name: yg.name,
      })),
    [blocksData]
  );
  // @ts-ignore
  return (
    <Autocomplete
      label={t('common:class')}
      fullWidth
      optionIdKey="blockId"
      optionTextKey="name"
      loading={isLoading}
      options={blocksOptions ?? []}
    />
  );
};
