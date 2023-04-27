import {
  Autocomplete as MiAutocomplete,
  AutocompleteProps as MiAutocompleteProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { useMemo } from 'react';

export type AutocompleteProps<T extends object | string> = Omit<
  MiAutocompleteProps<
    T,
    boolean,
    undefined,
    T extends string ? boolean : undefined
  >,
  'renderInput'
> & {
  label?: TextFieldProps['label'];
  placeholder?: TextFieldProps['placeholder'];
  inputProps?: Omit<TextFieldProps, 'label' | 'placeholder'>;
  optionIdKey?: T extends object ? keyof T : never;
  optionTextKey?: T extends object ? keyof T : never;
};

export const Autocomplete = <T extends object | string>({
  value,
  label,
  placeholder,
  optionIdKey,
  optionTextKey,
  options,
  inputProps,
  ...restAutocompleteProps
}: AutocompleteProps<T>) => {
  const selectedOption = useMemo<T | T[] | null>(() => {
    if (!value) return null;

    // for multiple selection
    if (restAutocompleteProps.multiple && Array.isArray(value)) {
      const valueAsArray = value as T[];

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
    const valueAsObject = value as T;

    return (
      options.find((option) => {
        // for enums
        if (typeof option === 'string') {
          return option === value;
        }

        // for objects
        if (optionIdKey) {
          return option[optionIdKey] === valueAsObject[optionIdKey];
        }

        return null;
      }) ?? null
    );
  }, [value, options]);

  return (
    <MiAutocomplete
      value={selectedOption}
      isOptionEqualToValue={(option, newValue) => {
        if (optionIdKey) {
          return option[optionIdKey] === newValue[optionIdKey];
        }

        return option === newValue;
      }}
      options={options}
      {...(optionTextKey && {
        getOptionLabel: (option) =>
          typeof option === 'string'
            ? option
            : (option[optionTextKey] as string),
      })}
      popupIcon={null}
      {...restAutocompleteProps}
      renderInput={(params) => (
        <TextField
          {...params}
          {...inputProps}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};
