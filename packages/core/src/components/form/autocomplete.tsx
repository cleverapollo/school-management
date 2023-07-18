import {
  FieldValues,
  Path,
  PathValue,
  useController,
  UseControllerProps,
} from 'react-hook-form';

import { Autocomplete, AutocompleteProps } from '../autocomplete';

export type RHFAutocompleteProps<
  TField extends FieldValues,
  TAutocompleteOption extends object | string,
  FreeSolo extends boolean | undefined = false
> = AutocompleteProps<TAutocompleteOption, FreeSolo> & {
  controlProps: UseControllerProps<TField>;
};

export const RHFAutocomplete = <
  TField extends FieldValues,
  TAutocompleteOption extends object | string,
  FreeSolo extends boolean | undefined = false
>({
  controlProps,
  ...restAutocompleteProps
}: RHFAutocompleteProps<TField, TAutocompleteOption, FreeSolo>) => {
  const {
    field: { value, onChange, ref, name },
    fieldState: { error },
  } = useController({
    defaultValue: (restAutocompleteProps.multiple ? [] : null) as PathValue<
      TField,
      Path<TField>
    >,
    ...controlProps,
  });

  return (
    <Autocomplete
      value={value ?? null}
      {...restAutocompleteProps}
      onChange={(event, newValue, ...restParams) => {
        onChange(newValue);
        restAutocompleteProps.onChange?.(event, newValue, ...restParams);
      }}
      inputProps={{
        name,
        inputRef: ref,
        error: !!error,
        helperText: error?.message,
        ...restAutocompleteProps.inputProps,
      }}
    />
  );
};
