import {
  Autocomplete,
  AutocompleteProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { useMemo } from 'react';
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

  const selectedOption = useMemo<
    TAutocompleteOption | TAutocompleteOption[] | null
  >(() => {
    const { options } = autocompleteProps;

    if (!value) return null;

    // for multiple selection
    if (Array.isArray(value)) {
      const valueAsArray = value as TAutocompleteOption[];

      return options.filter((option) => {
        // for enums
        if (typeof option === 'string') {
          return valueAsArray.includes(option);
        }

        if (optionIdKey) {
          // for objects
          return valueAsArray
            .map((v) => v[optionIdKey])
            .includes(option[optionIdKey]);
        }

        return null;
      });
    }

    // for one selection
    return (
      options.find((option) => {
        // for enums
        if (typeof option === 'string') {
          return option === value;
        }

        // for objects
        if (optionIdKey) {
          return option[optionIdKey] === value[optionIdKey];
        }

        return null;
      }) ?? null
    );
  }, [value, autocompleteProps.options]);

  return (
    <Autocomplete
      value={selectedOption}
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
