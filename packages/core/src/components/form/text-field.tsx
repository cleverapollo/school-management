import { TextField, TextFieldProps, useTheme } from '@mui/material';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

export type RHFTextFieldProps<TField extends FieldValues> = {
  label?: string;
  variant?: TextFieldProps['variant'] | 'white-filled';
  textFieldProps?: TextFieldProps;
  controlProps: UseControllerProps<TField>;
};

export const RHFTextField = <TField extends FieldValues>({
  label,
  variant,
  textFieldProps,
  controlProps,
}: RHFTextFieldProps<TField>) => {
  const {
    field: { ref, value, onChange, ...restField },
    fieldState: { error },
  } = useController(controlProps);

  const theme = useTheme();
  const { spacing, palette } = theme;

  const isWhiteFilledVariant = variant === 'white-filled';

  return (
    <TextField
      {...textFieldProps}
      {...restField}
      onChange={(e) => {
        onChange(e);
        textFieldProps?.onChange?.(e);
      }}
      variant={isWhiteFilledVariant ? 'filled' : variant}
      sx={{
        ...(typeof textFieldProps?.sx === 'function'
          ? textFieldProps.sx(theme)
          : textFieldProps?.sx),
        ...(isWhiteFilledVariant && {
          '& .MuiInputBase-root, & .MuiInputBase-root.Mui-focused': {
            backgroundColor: palette.background.default,
            borderRadius: spacing(1),
          },
          '& .MuiInputBase-root:hover': {
            backgroundColor: palette.primary.lighter,
          },
        }),
      }}
      value={value ?? ''}
      label={label}
      error={!!error}
      helperText={error?.message}
      inputRef={ref}
    />
  );
};
