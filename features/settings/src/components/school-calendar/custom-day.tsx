import { CalendarDayInfo } from '@tyro/api';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { getColourBasedOnDayType } from '@tyro/core';

dayjs.extend(isToday);

type CustomDayProps = {
  handleSelectDay: (event: React.MouseEvent, day: CalendarDayInfo) => void;
  selected: boolean;
  dayBellTime?: CalendarDayInfo;
} & PickersDayProps<Dayjs>;

export const CustomDay = (props: CustomDayProps) => {
  const { day, dayBellTime, handleSelectDay, onFocus, selected, ...other } =
    props;

  const isWeekend = dayjs(day).day() === 0 || dayjs(day).day() === 6;

  const { bgColor: backgroundColor, color } = getColourBasedOnDayType(
    dayBellTime?.dayType
  );

  const dayColor = selected ? backgroundColor : color;
  const dayBgColor = selected ? 'white' : backgroundColor;

  return (
    <PickersDay
      day={day}
      sx={(theme) => ({
        borderRadius: '50%',
        color: isWeekend ? 'white' : dayColor,
        minHeight: 36,
        borderWidth: selected ? 2 : 3,
        borderColor: selected ? backgroundColor : theme.palette.slate[50],
        borderStyle: 'solid',
        fontSize: theme.typography.pxToRem(14),
        fontWeight: '500 !important',
        zIndex: 2,
        '&, &:focus, &:hover': {
          backgroundColor: isWeekend ? theme.palette.grey[300] : dayBgColor,
        },
      })}
      onClick={(event) => {
        if (dayBellTime && !isWeekend) {
          handleSelectDay(event, dayBellTime);
        }
      }}
      {...other}
    />
  );
};
