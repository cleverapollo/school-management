import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  TextField,
} from '@mui/material';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type RHFAutocompleteProps<TField extends FieldValues, TAutocompleteOption> = {
  label?: string;
  optionIdKey: keyof TAutocompleteOption;
  optionTextKey?: keyof TAutocompleteOption;
  autocompleteProps: Omit<
    AutocompleteProps<TAutocompleteOption, boolean, undefined, undefined>,
    'renderInput'
  >;
  controlProps: UseControllerProps<TField>;
  inputProps?: AutocompleteRenderInputParams;
};

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
  } = useController(controlProps);

  return (
    <Autocomplete
      value={value ?? null}
      isOptionEqualToValue={(option, newValue) =>
        option[optionIdKey] === newValue[optionIdKey]
      }
      {...(optionTextKey && {
        getOptionLabel: (option) => option[optionTextKey] as string,
      })}
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
