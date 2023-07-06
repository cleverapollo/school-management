import { DateTimePickerProps, DateTimePicker } from '@mui/x-date-pickers';
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
  dateTimePickerProps?: Omit<
    DateTimePickerProps<TInputDate>,
    'onChange' | 'value' | 'renderInput'
  >;
  controlProps: UseControllerProps<TField>;
  inputProps?: TextFieldProps;
};

export const RHFDateTimePicker = <
  TField extends FieldValues,
  TInputDate = dayjs.Dayjs
>({
  label,
  dateTimePickerProps,
  controlProps,
  inputProps,
}: RHFDatePickerProps<TField, TInputDate>) => {
  const {
    field: { ref, onBlur, name, value, onChange },
    fieldState: { error },
  } = useController(controlProps);

  return (
    <DateTimePicker
      format="DD/MM/YYYY HH:mm"
      {...dateTimePickerProps}
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
  );
};
