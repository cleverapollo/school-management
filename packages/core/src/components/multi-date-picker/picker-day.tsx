import { Box } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { MultiDatePickerProps } from './types';
import { ReturnTypeUseDaySettings, useDaySettings } from './use-day-settings';

interface DayPickerContainerProps<TInputDate extends Dayjs>
  extends ReturnTypeUseDaySettings<TInputDate> {
  children: React.ReactNode;
}

const DayPickerContainer = <TInputDate extends Dayjs>({
  children,
  isHighlightLeft,
  isHighlightRight,
}: DayPickerContainerProps<TInputDate>) => (
  <Box
    sx={{
      px: '2px',
      ...(!isHighlightLeft && {
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
        ml: '2px',
        pl: 0,
      }),
      ...(!isHighlightRight && {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
        mr: '2px',
        pr: 0,
      }),
      ...((isHighlightLeft || isHighlightRight) && {
        backgroundColor: 'indigo.200',
      }),
    }}
  >
    {children}
  </Box>
);

export const MultiDatePickerDay = <TInputDate extends Dayjs>({
  pickerValue,
  ...props
}: PickersDayProps<TInputDate> & {
  pickerValue: MultiDatePickerProps<TInputDate>['value'];
}) => {
  const settings = useDaySettings<TInputDate>({
    day: props.day,
    pickerValue,
  });

  return (
    <DayPickerContainer {...settings}>
      <PickersDay
        {...props}
        disableMargin
        selected={settings.showSelectionCircle}
        aria-selected={settings.isSelected}
      />
    </DayPickerContainer>
  );
};
