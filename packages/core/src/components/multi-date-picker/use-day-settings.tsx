import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { MutableRefObject } from 'react';

dayjs.extend(isBetween);

export const dayKeyFormat = 'YYYY-MM-DD';

interface UseDaySettingsProps<TInputDate> {
  day: TInputDate;
  lastSelectedDayRef: MutableRefObject<TInputDate | undefined>;
  rangePreviewDay: TInputDate | undefined;
  showRangePreview: boolean;
  pickerValue: Map<string, TInputDate>;
  isOutsideMonth: boolean;
}

export function useDaySettings<TInputDate extends Dayjs>({
  day,
  showRangePreview,
  lastSelectedDayRef,
  rangePreviewDay,
  pickerValue,
  isOutsideMonth,
}: UseDaySettingsProps<TInputDate>) {
  const dayKey = day.format(dayKeyFormat);
  const lastSelectedDay = lastSelectedDayRef.current;

  const isSelected = pickerValue.has(dayKey);
  const isHighlightLeft =
    !isOutsideMonth &&
    isSelected &&
    pickerValue.has(day.subtract(1, 'day').format(dayKeyFormat));
  const isHighlightRight =
    !isOutsideMonth &&
    isSelected &&
    pickerValue.has(day.add(1, 'day').format(dayKeyFormat));

  const showPreviewRange =
    !isOutsideMonth && showRangePreview && lastSelectedDay && rangePreviewDay;
  const startOfPreviewRange =
    showPreviewRange && lastSelectedDay.isBefore(rangePreviewDay)
      ? lastSelectedDay
      : rangePreviewDay;
  const endOfPreviewRange =
    showPreviewRange && lastSelectedDay.isBefore(rangePreviewDay)
      ? rangePreviewDay
      : lastSelectedDay;

  return {
    isSelected,
    showSelectionCircle: isSelected && !(isHighlightLeft && isHighlightRight),
    isHighlightLeft,
    isHighlightRight,
    isFirstDayOfWeek: day.isSame(day.startOf('week'), 'day'),
    isLastDayOfWeek: day.isSame(day.endOf('week'), 'day'),
    isFirstDayOfMonth: day.isSame(day.startOf('month'), 'day'),
    isLastDayOfMonth: day.isSame(day.endOf('month'), 'day'),
    isStartOfPreviewRange:
      showPreviewRange && day.isSame(startOfPreviewRange, 'day'),
    isEndOfPreviewRange:
      showPreviewRange && day.isSame(endOfPreviewRange, 'day'),
    isInPreviewRange:
      showPreviewRange &&
      day.isBetween(startOfPreviewRange, endOfPreviewRange, 'day', '[]'),
  };
}

export type ReturnTypeUseDaySettings<TInputDate extends Dayjs> = ReturnType<
  typeof useDaySettings<TInputDate>
>;
