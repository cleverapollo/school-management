import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { DateRangePicker } from '../date-range-picker';

export type RHFDateRangePickerProps<TField extends FieldValues> = {
  label?: string;
  controlProps: UseControllerProps<TField>;
};

export const RHFDateRangePicker = <TField extends FieldValues>({
  label,
  controlProps,
}: RHFDateRangePickerProps<TField>) => {
  const {
    field: { ref, value, onChange, name, onBlur },
    fieldState: { error },
  } = useController(controlProps);

  return (
    <DateRangePicker
      dateRange={value}
      onChangeRange={onChange}
      textFieldProps={{
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
