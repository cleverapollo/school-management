import { TextFieldProps } from '@mui/material';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { DateRangePicker } from '../date-range-picker';

export type RHFDateRangePickerProps<TField extends FieldValues> = {
  label?: string;
  controlProps: UseControllerProps<TField>;
  textFieldProps?: TextFieldProps;
};

export const RHFDateRangePicker = <TField extends FieldValues>({
  label,
  controlProps,
  textFieldProps,
}: RHFDateRangePickerProps<TField>) => {
  const {
    field: { ref, value, onChange, name, onBlur },
    fieldState: { error },
  } = useController(controlProps);

  return (
    <DateRangePicker
      dateRange={value}
      onChangeRange={onChange}
      label={label}
      textFieldProps={{
        ...textFieldProps,
        label,
        name,
        onBlur,
        inputRef: ref,
        error: !!error,
        helperText: error?.message,
      }}
    />
  );
};
