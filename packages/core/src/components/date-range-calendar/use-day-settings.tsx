import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { DateRangeCalendarInternalValue } from './types';

dayjs.extend(isBetween);

export const dayKeyFormat = 'YYYY-MM-DD';

interface UseDaySettingsProps<TInputDate> {
  day: TInputDate;
  rangePreviewDay: TInputDate | undefined;
  lastSelectedDayIndex: React.MutableRefObject<number>;
  pickerValue: DateRangeCalendarInternalValue<TInputDate>;
  isOutsideMonth: boolean;
}

export function useDaySettings<TInputDate extends Dayjs>({
  day,
  rangePreviewDay,
  lastSelectedDayIndex,
  pickerValue,
  isOutsideMonth,
}: UseDaySettingsProps<TInputDate>) {
  const isRangeSelected = pickerValue?.length === 2;
  const isSelected =
    pickerValue?.[0]?.isSame(day, 'day') ||
    pickerValue?.[1]?.isSame(day, 'day') ||
    (isRangeSelected && day.isBetween(...pickerValue, 'day', '[]'));
  const startAndEndOfRangeAreTheSameDay =
    isRangeSelected && pickerValue[0].isSame(pickerValue[1], 'day');
  const isHighlighted =
    !isOutsideMonth &&
    isRangeSelected &&
    day.isBetween(...pickerValue, 'day', '()');
  const isHighlightLeft =
    isHighlighted ||
    (!startAndEndOfRangeAreTheSameDay &&
      isRangeSelected &&
      day.isSame(pickerValue[1], 'day') &&
      !isOutsideMonth);
  const isHighlightRight =
    isHighlighted ||
    (!startAndEndOfRangeAreTheSameDay &&
      isRangeSelected &&
      day.isSame(pickerValue[0], 'day') &&
      !isOutsideMonth);

  let startOfPreviewRange: TInputDate | null = null;
  let endOfPreviewRange: TInputDate | null = null;

  if (!isOutsideMonth && rangePreviewDay) {
    const [firstDay, lastDay] = pickerValue ?? [null, null];

    // Is selecting the first day of the range and last is already selected
    if (
      lastSelectedDayIndex.current === 1 &&
      firstDay &&
      lastDay &&
      rangePreviewDay.isBefore(firstDay)
    ) {
      startOfPreviewRange = rangePreviewDay;
      endOfPreviewRange = lastDay;

      // Is selecting the last day of the range but is after the first day
    } else if (
      lastSelectedDayIndex.current === 0 &&
      firstDay &&
      rangePreviewDay.isAfter(firstDay)
    ) {
      startOfPreviewRange = firstDay;
      endOfPreviewRange = rangePreviewDay;
    }
  }

  return {
    isSelected,
    showSelectionCircle: isSelected && !isHighlighted && !isOutsideMonth,
    isHighlightLeft,
    isHighlightRight,
    isFirstDayOfWeek: day.isSame(day.startOf('week'), 'day'),
    isLastDayOfWeek: day.isSame(day.endOf('week'), 'day'),
    isFirstDayOfMonth: day.isSame(day.startOf('month'), 'day'),
    isLastDayOfMonth: day.isSame(day.endOf('month'), 'day'),
    isStartOfPreviewRange: startOfPreviewRange?.isSame(day, 'day') ?? false,
    isEndOfPreviewRange: endOfPreviewRange?.isSame(day, 'day') ?? false,
    isInPreviewRange:
      startOfPreviewRange &&
      endOfPreviewRange &&
      day.isBetween(startOfPreviewRange, endOfPreviewRange, 'day', '[]'),
  };
}

export type ReturnTypeUseDaySettings<TInputDate extends Dayjs> = ReturnType<
  typeof useDaySettings<TInputDate>
>;
