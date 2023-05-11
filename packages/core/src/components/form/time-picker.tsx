import {
  TimePicker,
  TimePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { TextFieldProps } from '@mui/material';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

dayjs.extend(LocalizedFormat);

type RHFDatePickerProps<TField extends FieldValues, TInputDate> = {
  label?: string;
  timePickerProps?: Omit<
    TimePickerProps<TInputDate>,
    'onChange' | 'value' | 'renderInput'
  >;
  controlProps: UseControllerProps<TField>;
  inputProps?: TextFieldProps;
};

export const RHFTimePicker = <
  TField extends FieldValues,
  TInputDate = dayjs.Dayjs
>({
  label,
  timePickerProps,
  controlProps,
  inputProps,
}: RHFDatePickerProps<TField, TInputDate>) => {
  const {
    field: { ref, onBlur, name, value, onChange },
    fieldState: { error },
  } = useController(controlProps);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        {...timePickerProps}
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
