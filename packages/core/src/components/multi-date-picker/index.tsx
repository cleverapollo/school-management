import { useMemo, useCallback } from 'react';
import { DatePicker, PickersDayProps } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { MultiDatePickerDay } from './picker-day';
import { MultiDatePickerProps } from './types';

export const MultiDatePicker = <TInputDate extends Dayjs>({
  value,
  onChange,
  ...props
}: MultiDatePickerProps<TInputDate>) => {
  const sortedValue = useMemo(() => {
    if (!value) {
      return value;
    }

    return [...value].sort((a, b) => a.diff(b));
  }, [value]);

  const renderDay = useCallback(
    (pickersDayProps: PickersDayProps<TInputDate>) => (
      <MultiDatePickerDay {...pickersDayProps} pickerValue={sortedValue} />
    ),
    [sortedValue]
  );

  return (
    <DatePicker<TInputDate>
      {...props}
      slots={{
        day: renderDay,
      }}
    />
  );
};
