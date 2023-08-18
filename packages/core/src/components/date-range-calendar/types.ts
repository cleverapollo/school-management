import { DateCalendarProps } from '@mui/x-date-pickers';

export type DateRangeCalendarValue<TInputDate> = [TInputDate, TInputDate];

export type DateRangeCalendarInternalValue<TInputDate> =
  | [TInputDate]
  | [TInputDate, TInputDate]
  | undefined;

export interface DateRangeCalendarProps<TInputDate>
  extends Omit<DateCalendarProps<TInputDate>, 'value' | 'onChange'> {
  value: DateRangeCalendarValue<TInputDate> | undefined;
  onChange: (value: DateRangeCalendarValue<TInputDate>) => void;
  maxDateRange?: (firstSelectedValue: TInputDate) => TInputDate;
}
