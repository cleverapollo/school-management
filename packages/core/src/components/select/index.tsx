import {
  MenuItem,
  MenuItemProps,
  TextField,
  TextFieldProps,
  useTheme,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { ReactNode, useMemo } from 'react';

type SelectCustomVariant = Omit<TextFieldProps, 'variant'> & {
  variant?: TextFieldProps['variant'] | 'white-filled' | 'soft';
};

export type SelectProps<TSelectOption> = SelectCustomVariant & {
  options: TSelectOption[];
  getOptionLabel?: (option: TSelectOption) => string | ReactNode;
  customSelectRef?: TextFieldProps['ref'];
  optionIdKey?: keyof TSelectOption;
  optionTextKey?: TSelectOption extends object ? keyof TSelectOption : never;
  renderValue?: (option: TSelectOption) => ReactNode;
  menuItemProps?: MenuItemProps;
  loading?: boolean;
  headerComponent?: ReactNode;
};

export const Select = <TSelectOption extends string | number | object>({
  options,
  optionIdKey,
  optionTextKey,
  customSelectRef,
  getOptionLabel,
  variant,
  sx,
  SelectProps,
  renderValue,
  value,
  menuItemProps,
  loading,
  headerComponent,
  ...textFieldProps
}: SelectProps<TSelectOption>) => {
  const { spacing, palette } = useTheme();

  const isWhiteFilledVariant = variant === 'white-filled';
  const isSoftVariant = variant === 'soft';
  const customVariant = isWhiteFilledVariant || isSoftVariant;

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
      variant={customVariant ? 'filled' : variant}
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
            optionSelected ? (
              <Stack flexDirection="row" gap={1} alignItems="center">
                {loading && <CircularProgress size={16} />}
                {renderValue(optionSelected)}
              </Stack>
            ) : null,
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
        ...(isSoftVariant && {
          '& .MuiSelect-select.MuiSelect-filled.MuiInputBase-input.MuiFilledInput-input':
            {
              paddingRight: spacing(5),
            },
          '& .MuiFilledInput-root, & .MuiFilledInput-root:focus, & .MuiFilledInput-root.Mui-focused, & .MuiFilledInput-root:hover, & .MuiFilledInput-root, & .MuiFilledInput-input:focus, & .MuiFilledInput-input.Mui-focused, & .MuiFilledInput-input:hover':
            {
              backgroundColor: palette.indigo[50016],
              color: palette.indigo.dark,
              borderRadius: spacing(1),
            },
        }),
      }}
    >
      {headerComponent && (
        <Stack gap={1} component="li" mx={1}>
          {headerComponent}
          <Divider sx={{ borderColor: 'slate.200' }} />
        </Stack>
      )}
      {options.map((option) => {
        const optionValue = optionIdKey
          ? (option[optionIdKey] as string)
          : String(option);
        const optionLabel = optionTextKey
          ? (option[optionTextKey] as string)
          : getOptionLabel?.(option);

        return (
          <MenuItem key={optionValue} value={optionValue} {...menuItemProps}>
            {optionLabel ?? optionValue}
          </MenuItem>
        );
      })}
    </TextField>
  );
};
