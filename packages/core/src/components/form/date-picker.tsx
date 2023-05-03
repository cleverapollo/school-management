import {
  DatePicker,
  DatePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { TextFieldProps } from '@mui/material';
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
  inputProps?: TextFieldProps;
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        format="DD/MM/YYYY"
        {...datePickerProps}
        onChange={onChange}
        value={value ?? null}
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
    </LocalizationProvider>
  );
};
