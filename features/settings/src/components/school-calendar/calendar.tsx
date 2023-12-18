import { Box, Stack } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { AcademicNamespace, CalendarDayInfo, DayType } from '@tyro/api';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

dayjs.extend(isToday);

type MonthCalendarProps = {
  month: string;
  selectedDays: CalendarDayInfo[];
  handleSelectDay: (day: CalendarDayInfo) => void;
  bellTimes: CalendarDayInfo[];
};

type CustomDayProps = {
  handleSelectDay: (day: CalendarDayInfo) => void;
  bellTimes: CalendarDayInfo[];
  selected: boolean;
} & PickersDayProps<Dayjs>;

const getCalendarColors = (dayType: DayType | undefined) => {
  switch (dayType) {
    case DayType.SchoolDay:
      return {
        backgroundColor: 'blue.500',
        color: 'white',
      };
    case DayType.StaffDay:
      return {
        backgroundColor: 'orange.500',
        color: 'white',
      };
    case DayType.Holiday:
      return {
        backgroundColor: 'green.500',
        color: 'white',
      };
    default:
      return {
        backgroundColor: 'transparent',
        color: 'grey.300',
      };
  }
};

function CustomDay(props: CustomDayProps) {
  const { day, onDaySelect, bellTimes, handleSelectDay, ...other } = props;

  const dayToCheck = dayjs(day).format('YYYY-MM-DD');
  const dayBellTime = bellTimes?.find(
    (bellTime) => bellTime.date === dayToCheck
  );

  const { backgroundColor, color } = getCalendarColors(dayBellTime?.dayType);

  return (
    <PickersDay
      day={day}
      sx={{
        borderRadius: '50%',
        backgroundColor,
        color,
        '&:focus, &:hover': {
          backgroundColor,
        },
      }}
      onDaySelect={() => {
        if (dayBellTime) {
          handleSelectDay(dayBellTime);
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
          day: (props) =>
            CustomDay({
              ...props,
              handleSelectDay,
              bellTimes,
              selected: !!selectedDays.find(
                (day) => day.date === dayjs(props.day).format('YYYY-MM-DD')
              ),
            }),
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
  selectedDays: CalendarDayInfo[];
  setSelectedDays: Dispatch<SetStateAction<CalendarDayInfo[]>>;
};

export const SchoolCalendar = ({
  bellTimes,
  activeAcademicNamespace,
  dayTypeFilter,
  selectedDays,
  setSelectedDays,
}: SchoolCalendarProps) => {
  const [enableMultiSelect, setEnableMultiSelect] = useState(false);

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

  const handleSelectDay = (day: CalendarDayInfo) => {
    if (enableMultiSelect) {
      if (selectedDays.find(({ date }) => date === day.date)) {
        setSelectedDays((prev) => prev.filter((d) => d.date !== day.date));
      } else {
        setSelectedDays((prev) => [...prev, day]);
      }
    } else if (selectedDays.find(({ date }) => date === day.date)) {
      setSelectedDays([]);
    } else {
      setSelectedDays([day]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setEnableMultiSelect(true);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setEnableMultiSelect(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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
