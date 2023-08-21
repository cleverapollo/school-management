import { Box } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { DateRangeCalendarInternalValue } from './types';
import { ReturnTypeUseDaySettings, useDaySettings } from './use-day-settings';

interface DayPickerContainerProps<TInputDate extends Dayjs>
  extends ReturnTypeUseDaySettings<TInputDate> {
  children: React.ReactNode;
}

interface RangePickerDayProps<TInputDate extends Dayjs>
  extends Omit<PickersDayProps<TInputDate>, 'onDaySelect'> {
  pickerValue: DateRangeCalendarInternalValue<TInputDate>;
  onDaySelect: (event: React.MouseEvent, day: TInputDate) => void;
  lastSelectedDayIndex: React.MutableRefObject<number>;
  rangePreviewDay: TInputDate | undefined;
  setRangePreviewDay: React.Dispatch<
    React.SetStateAction<TInputDate | undefined>
  >;
}

const DayPickerContainer = <TInputDate extends Dayjs>({
  children,
  showSelectionCircle,
  isHighlightLeft,
  isHighlightRight,
  isFirstDayOfWeek,
  isLastDayOfWeek,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  isStartOfPreviewRange,
  isEndOfPreviewRange,
  isInPreviewRange,
}: DayPickerContainerProps<TInputDate>) => (
  <Box
    sx={{
      ...((!isHighlightLeft || isFirstDayOfWeek || isFirstDayOfMonth) && {
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
      }),
      ...((!isHighlightRight || isLastDayOfWeek || isLastDayOfMonth) && {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
      }),
      ...((isHighlightLeft || isHighlightRight) && {
        backgroundColor: 'primary.lighter',
      }),
      ...(showSelectionCircle &&
        isHighlightLeft && {
          mr: '1px',
        }),
      ...(showSelectionCircle &&
        isHighlightRight && {
          ml: '1px',
        }),
    }}
  >
    <Box
      sx={{
        borderWidth: '1px',
        px: '1px',
        borderStyle: 'dashed',
        borderColor: 'transparent',
        ...(isInPreviewRange && {
          borderTopColor: 'slate.400',
          borderBottomColor: 'slate.400',
        }),
        ...((isStartOfPreviewRange ||
          ((isFirstDayOfWeek || isFirstDayOfMonth) && isInPreviewRange)) && {
          borderTopLeftRadius: '50%',
          borderBottomLeftRadius: '50%',
          borderLeftColor: 'slate.400',
        }),
        ...((isEndOfPreviewRange ||
          ((isLastDayOfWeek || isLastDayOfMonth) && isInPreviewRange)) && {
          borderTopRightRadius: '50%',
          borderBottomRightRadius: '50%',
          borderRightColor: 'slate.400',
        }),
        ...(showSelectionCircle &&
          isHighlightLeft && {
            pr: 0,
          }),
        ...(showSelectionCircle &&
          isHighlightRight && {
            pl: 0,
          }),
      }}
    >
      {children}
    </Box>
  </Box>
);

export const RangePickerDay = <TInputDate extends Dayjs>({
  pickerValue,
  onDaySelect,
  lastSelectedDayIndex,
  rangePreviewDay,
  setRangePreviewDay,
  ...props
}: RangePickerDayProps<TInputDate>) => {
  const settings = useDaySettings<TInputDate>({
    day: props.day,
    rangePreviewDay,
    lastSelectedDayIndex,
    pickerValue,
    isOutsideMonth: props.outsideCurrentMonth,
  });

  useEffect(() => {
    if (props.autoFocus) {
      setRangePreviewDay(props.day);
    }
  }, [props.autoFocus]);

  return (
    <DayPickerContainer {...settings}>
      <PickersDay
        {...props}
        disableMargin
        onDaySelect={() => {}}
        onClick={(event) => {
          onDaySelect(event, props.day);
        }}
        onMouseEnter={() => {
          setRangePreviewDay(props.day);
        }}
        selected={settings.showSelectionCircle}
        aria-selected={settings.isSelected}
      />
    </DayPickerContainer>
  );
};
