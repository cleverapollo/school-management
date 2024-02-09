import { FieldValues } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  RHFAutocomplete,
  RHFAutocompleteProps,
  ICellEditorParams,
  TableAutocomplete,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  forwardRef,
  useMemo,
  ForwardedRef,
  useRef,
  useImperativeHandle,
} from 'react';
import {
  ReturnTypeFromUseClassGroups,
  useClassGroups,
} from '../../api/class-groups';

export interface ClassGroupSelect {
  partyId: number;
  name: string;
}

type RHFClassGroupAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, ClassGroupSelect>,
  'options'
>;

type ClassGroupAutocompleteProps = Omit<
  AutocompleteProps<ClassGroupSelect>,
  | 'optionIdKey'
  | 'optionTextKey'
  | 'getOptionLabel'
  | 'filterOptions'
  | 'renderAvatarTags'
  | 'renderAvatarOption'
  | 'renderAvatarAdornment'
>;

export const RHFClassGroupAutocomplete = <TField extends FieldValues>(
  props: RHFClassGroupAutocompleteProps<TField>
) => {
  const { t } = useTranslation(['common']);
  const { data: classGroupData, isLoading } = useClassGroups();

  const classGroupOptions = useMemo(
    () =>
      classGroupData?.map((yg) => ({
        partyId: yg.partyId,
        name: yg.name,
      })),
    [classGroupData]
  );

  // @ts-ignore
  return (
    <RHFAutocomplete<TField, ClassGroupSelect>
      label={t('common:class')}
      {...props}
      fullWidth
      optionIdKey="partyId"
      optionTextKey="name"
      loading={isLoading}
      options={classGroupOptions ?? []}
    />
  );
};

export const ClassGroupAutocomplete = (props: ClassGroupAutocompleteProps) => {
  const { t } = useTranslation(['common']);
  const { data: classGroupData, isLoading } = useClassGroups();

  const classGroupOptions = useMemo(
    () =>
      classGroupData?.map((yg) => ({
        partyId: yg.partyId,
        name: yg.name,
      })),
    [classGroupData]
  );
  // @ts-ignore
  return (
    <Autocomplete
      label={t('common:class')}
      fullWidth
      optionIdKey="partyId"
      optionTextKey="name"
      loading={isLoading}
      options={classGroupOptions ?? []}
    />
  );
};

type TableClassGroupAutocompleteValue = Pick<
  ReturnTypeFromUseClassGroups,
  'partyId' | 'name'
>;

export const TableClassGroupAutocomplete = forwardRef(
  (
    props: ICellEditorParams<unknown, TableClassGroupAutocompleteValue>,
    ref: ForwardedRef<unknown>
  ) => {
    const autoCompleteRef = useRef<{
      getValue: () => TableClassGroupAutocompleteValue | null;
      afterGuiAttached: () => void;
    }>();
    const { t } = useTranslation(['common']);
    const { data: classGroupData, isLoading } = useClassGroups();

    useImperativeHandle(ref, () => ({
      getValue() {
        return autoCompleteRef?.current?.getValue();
      },
    }));

    return (
      // @ts-expect-error
      <TableAutocomplete
        ref={autoCompleteRef}
        {...props}
        options={classGroupData ?? []}
        getOptionLabel={(option) => option?.name ?? ''}
        optionIdKey="partyId"
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
  TableClassGroupAutocomplete.displayName = 'TableClassGroupAutocomplete';
}
