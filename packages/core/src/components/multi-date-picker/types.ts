import { DatePickerProps } from '@mui/x-date-pickers';

export interface MultiDatePickerProps<TInputDate>
  extends Omit<DatePickerProps<TInputDate>, 'value' | 'onChange'> {
  value: Array<TInputDate>;
  onChange: (value: Array<TInputDate>) => void;
}
