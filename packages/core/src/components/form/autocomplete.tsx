import {
  Autocomplete,
  AutocompleteProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import {
  FieldValues,
  Path,
  PathValue,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type AutocompleteObjectOption<TAutocompleteOption> = {
  optionIdKey: keyof TAutocompleteOption;
  optionTextKey?: keyof TAutocompleteOption;
};

type AutocompleteSimpleOption = {
  optionIdKey?: never;
  optionTextKey?: never;
};

type AutocompleteBaseProps<TField extends FieldValues, TAutocompleteOption> = {
  label?: string;
  autocompleteProps: Omit<
    AutocompleteProps<
      TAutocompleteOption,
      boolean,
      undefined,
      TAutocompleteOption extends string ? boolean : undefined
    >,
    'renderInput'
  >;
  controlProps: UseControllerProps<TField>;
  inputProps?: TextFieldProps;
};

export type RHFAutocompleteProps<
  TField extends FieldValues,
  TAutocompleteOption
> = (TAutocompleteOption extends string | number
  ? AutocompleteSimpleOption
  : AutocompleteObjectOption<TAutocompleteOption>) &
  AutocompleteBaseProps<TField, TAutocompleteOption>;

export const RHFAutocomplete = <
  TField extends FieldValues,
  TAutocompleteOption
>({
  label,
  optionIdKey,
  optionTextKey,
  autocompleteProps,
  controlProps,
  inputProps,
}: RHFAutocompleteProps<TField, TAutocompleteOption>) => {
  const {
    field: { value, onChange, ref, name },
    fieldState: { error },
  } = useController({
    ...controlProps,
    defaultValue: (autocompleteProps.multiple ? [] : null) as PathValue<
      TField,
      Path<TField>
    >,
  });

  return (
    <Autocomplete
      value={value}
      isOptionEqualToValue={(option, newValue) => {
        if (optionIdKey) {
          return option[optionIdKey] === newValue[optionIdKey];
        }

        return option === newValue;
      }}
      {...(optionTextKey && {
        getOptionLabel: (option) =>
          typeof option === 'string'
            ? option
            : (option[optionTextKey] as string),
      })}
      popupIcon={null}
      {...autocompleteProps}
      onChange={(event, newValue, ...restParams) => {
        onChange(newValue);
        autocompleteProps.onChange?.(event, newValue, ...restParams);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...inputProps}
          label={label}
          name={name}
          inputRef={ref}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};
