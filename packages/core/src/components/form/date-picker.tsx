import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';

import { TextFieldProps, useTheme } from '@mui/material';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import dayjs from 'dayjs';

type RHFDatePickerProps<TField extends FieldValues, TInputDate> = {
  label?: string;
  datePickerProps?: Omit<
    DatePickerProps<TInputDate>,
    'onChange' | 'value' | 'renderInput'
  >;
  controlProps: UseControllerProps<TField>;
  inputProps?: Omit<TextFieldProps, 'variant'> & {
    variant?: TextFieldProps['variant'] | 'white-filled';
  };
};

export const RHFDatePicker = <
  TField extends FieldValues,
  TInputDate = dayjs.Dayjs
>({
  label,
  datePickerProps,
  controlProps,
  inputProps,
}: RHFDatePickerProps<TField, TInputDate>) => {
  const {
    field: { ref, onBlur, name, value, onChange },
    fieldState: { error },
  } = useController(controlProps);
  const { spacing, palette } = useTheme();

  const { variant } = inputProps ?? {};
  const isWhiteFilledVariant = variant === 'white-filled';

  return (
    <DatePicker
      {...datePickerProps}
      onChange={onChange}
      value={value ?? null}
      label={label}
      inputRef={ref}
      slotProps={{
        textField: {
          ...inputProps,
          variant: isWhiteFilledVariant ? 'filled' : variant,
          sx: {
            ...inputProps?.sx,
            ...(isWhiteFilledVariant && {
              '& .MuiInputBase-root, & .MuiInputBase-root.Mui-focused': {
                backgroundColor: palette.background.default,
                borderRadius: spacing(1),
              },
              '& .MuiInputBase-root:hover': {
                backgroundColor: palette.primary.lighter,
              },
            }),
          },
          onBlur,
          name,
          error: !!error,
          helperText: error?.message,
        },
      }}
    />
  );
};
