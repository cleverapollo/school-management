import { MenuItem, TextField, TextFieldProps, useTheme } from '@mui/material';

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
};

export const Select = <TSelectOption extends string | number | object>({
  options,
  optionIdKey,
  customSelectRef,
  getOptionLabel,
  variant,
  sx,
  SelectProps,
  ...textFieldProps
}: SelectProps<TSelectOption>) => {
  const { spacing, palette } = useTheme();

  const isWhiteFilledVariant = variant === 'white-filled';

  return (
    <TextField
      {...textFieldProps}
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
      }}
      sx={{
        ...sx,
        ...(isWhiteFilledVariant && {
          '& .MuiFilledInput-root, & .MuiFilledInput-root:focus, & .MuiFilledInput-root.Mui-focused, & .MuiFilledInput-root:hover, & .MuiFilledInput-root, & .MuiFilledInput-input:focus, & .MuiFilledInput-input.Mui-focused, & .MuiFilledInput-input:hover':
            {
              backgroundColor: palette.background.default,
              borderRadius: spacing(1),
            },
          '& .MuiSelect-icon': {
            color: palette.primary.main,
          },
        }),
      }}
    >
      {options.map((option) => {
        const value = optionIdKey
          ? (option[optionIdKey] as string)
          : String(option);

        return (
          <MenuItem key={value} value={value}>
            {getOptionLabel(option)}
          </MenuItem>
        );
      })}
    </TextField>
  );
};
