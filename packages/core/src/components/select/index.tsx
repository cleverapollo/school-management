import { MenuItem, TextField, TextFieldProps, useTheme } from '@mui/material';
import { ReactNode, useMemo } from 'react';

type SelectCustomVariant = Omit<TextFieldProps, 'variant'> & {
  variant?: TextFieldProps['variant'] | 'white-filled';
};

export type SelectProps<TSelectOption> = SelectCustomVariant & {
  options: TSelectOption[];
  getOptionLabel: (option: TSelectOption) => string;
  customSelectRef?: TextFieldProps['ref'];
  optionIdKey?: TSelectOption extends string | number
    ? never
    : keyof TSelectOption;
  renderValue?: (option: TSelectOption) => ReactNode;
};

export const Select = <TSelectOption extends string | number | object>({
  options,
  optionIdKey,
  customSelectRef,
  getOptionLabel,
  variant,
  sx,
  SelectProps,
  renderValue,
  value,
  ...textFieldProps
}: SelectProps<TSelectOption>) => {
  const { spacing, palette } = useTheme();

  const isWhiteFilledVariant = variant === 'white-filled';

  const optionSelected = useMemo(
    () =>
      options.find((currentOption) => {
        const currentValue = optionIdKey
          ? (currentOption[optionIdKey] as string)
          : String(currentOption);

        return currentValue === value;
      }),
    [options, optionIdKey, value]
  );

  return (
    <TextField
      {...textFieldProps}
      value={value}
      variant={isWhiteFilledVariant ? 'filled' : variant}
      ref={customSelectRef}
      select
      SelectProps={{
        ...SelectProps,
        MenuProps: {
          ...SelectProps?.MenuProps,
          sx: {
            maxHeight: spacing(44),
            ...SelectProps?.MenuProps?.sx,
          },
        },
        ...(renderValue && {
          renderValue: () =>
            optionSelected ? renderValue(optionSelected) : null,
        }),
      }}
      sx={{
        ...sx,
        ...(isWhiteFilledVariant && {
          '& .MuiFilledInput-root, & .MuiFilledInput-root:focus, & .MuiFilledInput-root.Mui-focused, & .MuiFilledInput-root:hover, & .MuiFilledInput-root, & .MuiFilledInput-input:focus, & .MuiFilledInput-input.Mui-focused, & .MuiFilledInput-input:hover':
            {
              backgroundColor: palette.background.default,
              borderRadius: spacing(1),
            },
        }),
      }}
    >
      {options.map((option) => {
        const optionValue = optionIdKey
          ? (option[optionIdKey] as string)
          : String(option);

        return (
          <MenuItem key={optionValue} value={optionValue}>
            {getOptionLabel(option)}
          </MenuItem>
        );
      })}
    </TextField>
  );
};
