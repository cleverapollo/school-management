import { TextFieldProps } from '@mui/material';
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
  inputProps?: TextFieldProps;
};

export const RHFDatePicker = <
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
          onBlur,
          name,
          error: !!error,
          helperText: error?.message,
        },
      }}
    />
  );
};
