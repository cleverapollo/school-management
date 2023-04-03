import {
  DatePicker,
  DatePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { TextField, TextFieldProps } from '@mui/material';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type RHFDatePickerProps<TField extends FieldValues, TInputDate, TDate> = {
  label?: string;
  datePickerProps?: Omit<
    DatePickerProps<TInputDate, TDate>,
    'onChange' | 'value' | 'renderInput'
  >;
  controlProps: UseControllerProps<TField>;
  inputProps?: TextFieldProps;
};

export const RHFDatePicker = <
  TField extends FieldValues,
  TInputDate = Date,
  TDate = TInputDate
>({
  label,
  datePickerProps,
  controlProps,
  inputProps,
}: RHFDatePickerProps<TField, TInputDate, TDate>) => {
  const {
    field: { ref, onBlur, name, value, onChange },
    fieldState: { error },
  } = useController(controlProps);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        inputFormat="DD/MM/YYYY"
        {...datePickerProps}
        onChange={onChange}
        value={value ?? null}
        label={label}
        inputRef={ref}
        renderInput={(params) => (
          <TextField
            {...params}
            {...inputProps}
            onBlur={onBlur}
            name={name}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
    </LocalizationProvider>
  );
};
