import { Dayjs } from 'dayjs';
import { MultiDatePickerProps } from './types';

function findIndexInValue<TInputDate extends Dayjs>(
  date: TInputDate,
  value: Array<TInputDate>
) {
  return value.findIndex((d) => d.isSame(date, 'day'));
}

interface UseDaySettingsProps<TInputDate> {
  day: TInputDate;
  pickerValue: MultiDatePickerProps<TInputDate>['value'];
}

export function useDaySettings<TInputDate extends Dayjs>({
  day,
  pickerValue,
}: UseDaySettingsProps<TInputDate>) {
  const valueIndex = findIndexInValue(day, pickerValue);

  const isSelected = valueIndex !== -1;
  const isHighlightLeft =
    isSelected &&
    pickerValue[valueIndex - 1]?.isSame(day.subtract(1, 'day'), 'day');
  const isHighlightRight =
    isSelected && pickerValue[valueIndex + 1]?.isSame(day.add(1, 'day'), 'day');

  return {
    isSelected,
    showSelectionCircle: isSelected && !(isHighlightLeft && isHighlightRight),
    isHighlightLeft,
    isHighlightRight,
  };
}

export type ReturnTypeUseDaySettings<TInputDate extends Dayjs> = ReturnType<
  typeof useDaySettings<TInputDate>
>;
