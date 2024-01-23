import { useMemo } from 'react';
import { CalendarDayInfo } from '@tyro/api';
import { Stack, Tooltip, Box } from '@mui/material';
import { PickersDayProps, DateCalendar } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { CustomDay } from './custom-day';

dayjs.extend(isToday);

type MonthCalendarProps = {
  month: string;
  selectedDays: string[];
  handleSelectDay: (event: React.MouseEvent, day: CalendarDayInfo) => void;
  bellTimes: CalendarDayInfo[];
};

export const MonthCalendar = ({
  month,
  bellTimes,
  selectedDays,
  handleSelectDay,
}: MonthCalendarProps) => {
  const enableDays = useMemo(
    () =>
      selectedDays.filter(
        (date) => !!bellTimes.find((day) => day.date === date)
      ),
    [selectedDays, bellTimes]
  );

  const renderDay = (props: PickersDayProps<Dayjs>) => {
    const { day: pickerDay, outsideCurrentMonth } = props ?? {};

    const isSelected = enableDays.some(
      (date) => date === dayjs(pickerDay).format('YYYY-MM-DD')
    );

    const beforeDaySelected = enableDays.includes(
      dayjs(pickerDay).add(-1, 'day').format('YYYY-MM-DD')
    );
    const afterDaySelected = enableDays.includes(
      dayjs(pickerDay).add(1, 'day').format('YYYY-MM-DD')
    );

    const selectedDayBgProps = {
      backgroundColor: isSelected ? 'indigo.200' : 'transparent',
      borderWidth: '1px 0 1px',
      borderColor: isSelected ? 'indigo.500' : 'transparent',
      borderStyle: 'solid',
      height: '100%',
      width: '50%',
      position: 'absolute',
    };

    const dayToCheck = dayjs(pickerDay).format('YYYY-MM-DD');
    const dayBellTime = bellTimes?.find(
      (bellTime) => bellTime.date === dayToCheck
    );

    return (
      <Stack
        justifyContent="center"
        position="relative"
        sx={{
          height: 36,
        }}
      >
        <Tooltip title={dayBellTime?.description ?? ''}>
          {CustomDay({
            ...props,
            handleSelectDay,
            dayBellTime,
            selected: isSelected,
          })}
        </Tooltip>
        {dayBellTime !== undefined &&
          beforeDaySelected &&
          !outsideCurrentMonth && (
            <Box sx={{ ...selectedDayBgProps, left: 0 }} />
          )}
        {dayBellTime !== undefined &&
          afterDaySelected &&
          !outsideCurrentMonth && (
            <Box sx={{ ...selectedDayBgProps, right: 0 }} />
          )}
      </Stack>
    );
  };

  return (
    <Box
      key={month}
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <DateCalendar
        view="day"
        defaultCalendarMonth={dayjs(month)}
        disableHighlightToday
        slots={{
          day: renderDay,
        }}
        sx={(theme) => ({
          mt: theme.spacing(2),
          boxShadow: '0 1px 6px 0 rgba(99, 102, 241, 0.1)',
          backgroundColor: 'white',
          borderRadius: theme.shape.borderRadius * 0.15625,
          '& .MuiDateCalendar-root': {
            backgroundColor: 'white',
          },
          '& .MuiPickersCalendarHeader-root': {
            marginTop: theme.spacing(1),
            marginBottom: 0,
            color: theme.palette.slate[800],
          },
          // Month label
          '& .MuiPickersCalendarHeader-label': {
            fontWeight: '800',
            color: theme.palette.slate[800],
          },
          '& .MuiPickersCalendarHeader-switchViewIcon, .MuiPickersArrowSwitcher-root':
            {
              display: 'none',
            },
          '& .MuiDayCalendar-header': {
            marginBottom: theme.spacing(1),
          },
          // Day of week title
          '& .MuiDayCalendar-weekDayLabel': {
            fontWeight: '700',
            color: theme.palette.slate[500],
          },
          '& .MuiPickersCalendarHeader-labelContainer': {
            marginLeft: 'auto',
            marginRight: 'auto',
          },
          // numbered days
          '& .MuiDayCalendar-weekContainer .MuiPickersDay-root': {
            fontWeight: '600',
          },
        })}
      />
    </Box>
  );
};
