import { Box, Stack } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { AcademicNamespace, DayType } from '@tyro/api';
import { ReturnTypeFromCalendarDayBellTimes } from '@tyro/calendar';

dayjs.extend(isToday);

type MonthCalendarProps = {
  month: string;
  bellTimes: ReturnTypeFromCalendarDayBellTimes;
};

type CustomDayProps = {
  bellTimes: ReturnTypeFromCalendarDayBellTimes;
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
        backgroundColor: 'purple.400',
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
  const { day, onDaySelect, bellTimes, ...other } = props;

  const dayToCheck = dayjs(day).format('YYYY-MM-DD');
  const dayBellTime = bellTimes.find(
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
      }}
      onDaySelect={() => {
        dayjs(day).format('YYYY-MM-DD');
      }}
      {...other}
    />
  );
}

function MonthCalendar({ month, bellTimes }: MonthCalendarProps) {
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
              bellTimes,
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
  bellTimes: ReturnTypeFromCalendarDayBellTimes;
  activeAcademicNamespace?: AcademicNamespace;
  dayType: DayType | 'All';
};

export const SchoolCalendar = ({
  bellTimes,
  activeAcademicNamespace,
  dayType,
}: SchoolCalendarProps) => {
  const startDate = dayjs(activeAcademicNamespace?.startDate);
  const endDate = dayjs(activeAcademicNamespace?.endDate);
  const months = [];

  const diffInMonths = endDate.diff(startDate, 'month');
  const totalMonths = diffInMonths + 1;
  const filteredBellTimes =
    dayType === 'All'
      ? bellTimes
      : bellTimes.filter((bellTime) => bellTime.dayType === dayType);

  for (let i = 0; i <= totalMonths; i += 1) {
    months.push(startDate.add(i, 'month').format('YYYY-MM-DD'));
  }

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
          bellTimes={filteredBellTimes}
        />
      ))}
    </Stack>
  );
};
