import { FieldValues } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  ICellEditorParams,
  RHFAutocomplete,
  RHFAutocompleteProps,
  TableAutocomplete,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { forwardRef, ForwardedRef, useRef, useImperativeHandle } from 'react';
import { UseQueryReturnType } from '@tyro/api';
import {
  ReturnTypeOfUseBlocksList,
  useBlocksList,
} from '../../api/blocks-list';

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

export const TableBlockAutocomplete = forwardRef(
  (props: ICellEditorParams<unknown, string>, ref: ForwardedRef<unknown>) => {
    const autoCompleteRef = useRef<{
      getValue: () => Pick<ReturnTypeOfUseBlocksList[number], 'name'> | null;
      afterGuiAttached: () => void;
    }>();
    const { t } = useTranslation(['common']);
    const { data: blocksData, isLoading } = useBlocksList({});

    useImperativeHandle(ref, () => ({
      getValue() {
        const value = autoCompleteRef?.current?.getValue();
        return value?.name ?? null;
      },
    }));

    return (
      // @ts-expect-error
      <TableAutocomplete<Pick<ReturnTypeOfUseBlocksList[number], 'name'> | null>
        ref={autoCompleteRef}
        {...props}
        options={blocksData ?? []}
        value={props.value ? { name: props.value } : null}
        getOptionLabel={(option) => option?.name ?? ''}
        optionIdKey="name"
        AutocompleteProps={{
          autoHighlight: true,
          loading: isLoading,
          loadingText: t('common:loading'),
        }}
      />
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  TableBlockAutocomplete.displayName = 'TableBlockAutocomplete';
}
