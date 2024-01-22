import { Dispatch, SetStateAction, useRef } from 'react';
import { Box, Stack, Tooltip } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { AcademicNamespace, CalendarDayInfo, DayType } from '@tyro/api';
import { getColourBasedOnDayType, wasMultiSelectKeyUsed } from '@tyro/core';

dayjs.extend(isToday);

type MonthCalendarProps = {
  month: string;
  selectedDays: string[];
  handleSelectDay: (event: React.MouseEvent, day: CalendarDayInfo) => void;
  bellTimes: CalendarDayInfo[];
};

type CustomDayProps = {
  handleSelectDay: (event: React.MouseEvent, day: CalendarDayInfo) => void;
  selected: boolean;
  dayBellTime?: CalendarDayInfo;
} & PickersDayProps<Dayjs>;

function CustomDay(props: CustomDayProps) {
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
      sx={{
        borderRadius: '50%',
        color: !isWeekend ? dayColor : 'white',
        minHeight: 36,
        borderWidth: selected ? 2 : 3,
        borderColor: selected ? backgroundColor : 'slate.50',
        borderStyle: 'solid',
        fontSize: 14,
        fontWeight: '500 !important',
        zIndex: 2,
        '&, &:focus, &:hover': {
          backgroundColor: !isWeekend ? dayBgColor : 'grey.300',
        },
      }}
      onClick={(event) => {
        if (dayBellTime && !isWeekend) {
          handleSelectDay(event, dayBellTime);
        }
      }}
      {...other}
    />
  );
}

function MonthCalendar({
  month,
  bellTimes,
  selectedDays,
  handleSelectDay,
}: MonthCalendarProps) {
  const renderDay = (props: PickersDayProps<Dayjs>) => {
    const { day: pickerDay, outsideCurrentMonth } = props ?? {};

    const enableDays = selectedDays.filter(
      (date) => !!bellTimes.find((day) => day.date === date)
    );

    const isSelected = !!enableDays.find(
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
        sx={{
          mt: 2,
          boxShadow: '0 1px 6px 0 rgba(99, 102, 241, 0.1)',
          backgroundColor: 'white',
          borderRadius: '10px',
          '& .MuiDateCalendar-root': {
            backgroundColor: 'white',
          },
          '& .MuiPickersCalendarHeader-root': {
            marginTop: 1,
            marginBottom: 0,
            color: 'slate.800',
          },
          // Month label
          '& .MuiPickersCalendarHeader-label': {
            fontWeight: '800',
            color: 'slate.800',
          },
          '& .MuiPickersCalendarHeader-switchViewIcon, .MuiPickersArrowSwitcher-root':
            {
              display: 'none',
            },
          '& .MuiDayCalendar-header': {
            marginBottom: 1,
          },
          // Day of week title
          '& .MuiDayCalendar-weekDayLabel': {
            fontWeight: '700',
            color: 'slate.500',
          },
          '& .MuiPickersCalendarHeader-labelContainer': {
            marginLeft: 'auto',
            marginRight: 'auto',
          },
          // numbered days
          '& .MuiDayCalendar-weekContainer .MuiPickersDay-root': {
            fontWeight: '600',
          },
        }}
      />
    </Box>
  );
}

type SchoolCalendarProps = {
  bellTimes: CalendarDayInfo[];
  activeAcademicNamespace?: AcademicNamespace;
  dayTypeFilter: DayType | 'All';
  selectedDays: string[];
  setSelectedDays: Dispatch<SetStateAction<string[]>>;
};

export const SchoolCalendar = ({
  bellTimes,
  activeAcademicNamespace,
  dayTypeFilter,
  selectedDays,
  setSelectedDays,
}: SchoolCalendarProps) => {
  const lastSelectedDate = useRef<string | null>(null);

  const startDate = dayjs(activeAcademicNamespace?.startDate);
  const endDate = dayjs(activeAcademicNamespace?.endDate);
  const months = [];

  const diffInMonths = endDate.diff(startDate, 'month');
  const totalMonths = diffInMonths + 1;
  const filteredBellTimes =
    dayTypeFilter === 'All'
      ? bellTimes
      : bellTimes.filter((bellTime) => bellTime.dayType === dayTypeFilter);

  for (let i = 0; i <= totalMonths; i += 1) {
    months.push(startDate.add(i, 'month').format('YYYY-MM-DD'));
  }

  const handleSelectDay = (event: React.MouseEvent, day: CalendarDayInfo) => {
    if (wasMultiSelectKeyUsed(event) && lastSelectedDate.current !== null) {
      const from = dayjs(day.date)?.isBefore(lastSelectedDate.current)
        ? day.date
        : lastSelectedDate.current;
      const to = dayjs(day.date)?.isAfter(lastSelectedDate.current)
        ? day.date
        : lastSelectedDate.current;

      const dateRange = Array.from(
        { length: dayjs(to).diff(from, 'day') + 1 },
        (_, index) => dayjs(from).add(index, 'day').format('YYYY-MM-DD')
      ).filter((d) => dayjs(d).day() !== 0 && dayjs(d).day() !== 6);
      setSelectedDays((prev) => Array.from(new Set([...prev, ...dateRange])));
    } else if (selectedDays.find((date) => date === day.date)) {
      setSelectedDays((prev) => prev.filter((d) => d !== day.date));
    } else {
      setSelectedDays((prev) => [...prev, day.date]);
    }

    lastSelectedDate.current = day.date;
  };

  return (
    <Stack
      flexDirection={{ xs: 'column', sm: 'row' }}
      flexWrap={{ xs: 'nowrap', sm: 'wrap' }}
      justifyContent={{ xs: 'center', sm: 'space-evenly' }}
      gap={2}
    >
      {months.map((month) => (
        <MonthCalendar
          key={month}
          month={month}
          handleSelectDay={handleSelectDay}
          selectedDays={selectedDays}
          bellTimes={filteredBellTimes}
        />
      ))}
    </Stack>
  );
};
