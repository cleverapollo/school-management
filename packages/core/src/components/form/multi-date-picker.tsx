import { TextFieldProps, useTheme } from '@mui/material';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { Dayjs } from 'dayjs';
import { MultiDatePicker, MultiDatePickerProps } from '../multi-date-picker';

type RHFMultiDatePickerProps<TField extends FieldValues, TInputDate> = {
  label?: string;
  datePickerProps?: Omit<
    MultiDatePickerProps<TInputDate>,
    'onChange' | 'value' | 'renderInput'
  >;
  controlProps: UseControllerProps<TField>;
  inputProps?: Omit<TextFieldProps, 'variant'> & {
    variant?: TextFieldProps['variant'] | 'white-filled';
  };
};

export const RHFMultiDatePicker = <
  TField extends FieldValues,
  TInputDate extends Dayjs
>({
  label,
  datePickerProps,
  controlProps,
  inputProps,
}: RHFMultiDatePickerProps<TField, TInputDate>) => {
  const {
    field: { ref, onBlur, name, value, onChange },
    fieldState: { error },
  } = useController(controlProps);
  const { spacing, palette } = useTheme();

  const { variant } = inputProps ?? {};
  const isWhiteFilledVariant = variant === 'white-filled';

  return (
    <MultiDatePicker
      {...datePickerProps}
      onChange={onChange}
      value={value}
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
