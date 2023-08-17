import { DateCalendar, PickersDayProps } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RangePickerDay } from './picker-day';
import {
  DateRangeCalendarInternalValue,
  DateRangeCalendarProps,
} from './types';

export type { DateRangeCalendarProps } from './types';

export const DateRangeCalendar = <TInputDate extends Dayjs>({
  value,
  onChange,
  maxDateRange,
  ...props
}: DateRangeCalendarProps<TInputDate>) => {
  const lastSelectedDayIndex = useRef<number>(1);
  const [internalValue, setInternalValue] =
    useState<DateRangeCalendarInternalValue<TInputDate>>(value);
  const [rangePreviewDay, setRangePreviewDay] = useState<TInputDate>();

  const onDaySelect = useCallback(
    (_e: React.MouseEvent, day: TInputDate) => {
      let newValue = (internalValue ? [...internalValue] : []) as NonNullable<
        DateRangeCalendarInternalValue<TInputDate>
      >;

      if (lastSelectedDayIndex.current === 1) {
        lastSelectedDayIndex.current = 0;

        if (newValue[1] && day.isAfter(newValue[1], 'day')) {
          newValue = [day];
        } else {
          newValue[0] = day;

          if (maxDateRange) {
            const maxSecondDate = maxDateRange(day);
            if (newValue[1] && newValue[1].isAfter(maxSecondDate, 'day')) {
              newValue[1] = maxSecondDate;
            }
          }
        }
      } else if (newValue[0] && day.isBefore(newValue[0], 'day')) {
        lastSelectedDayIndex.current = 0;
        newValue = [day];
      } else {
        lastSelectedDayIndex.current = 1;
        newValue[1] = day;
      }

      setInternalValue(newValue);

      if (newValue.length === 2) {
        onChange(newValue);
      }
    },
    [internalValue, value]
  );

  const renderDay = useCallback(
    (pickersDayProps: PickersDayProps<TInputDate>) => (
      <RangePickerDay
        {...pickersDayProps}
        pickerValue={internalValue}
        onDaySelect={onDaySelect}
        lastSelectedDayIndex={lastSelectedDayIndex}
        rangePreviewDay={rangePreviewDay}
        setRangePreviewDay={setRangePreviewDay}
      />
    ),
    [internalValue, onDaySelect, rangePreviewDay, setRangePreviewDay]
  );

  useEffect(() => {
    if (value) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <DateCalendar
      slots={{
        day: renderDay,
      }}
      defaultCalendarMonth={internalValue?.[0]}
      {...props}
    />
  );
};
