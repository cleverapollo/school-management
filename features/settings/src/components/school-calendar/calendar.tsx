import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import {
  AcademicNamespace,
  AttendanceCodeType,
  CalendarDayBellTime,
  usePermissions,
} from '@tyro/api';

dayjs.extend(isToday);

type MonthCalendarProps = {
  month: string;
  bellTimes: CalendarDayBellTime[];
};

type CustomDayProps = {
  bellTimes: CalendarDayBellTime[];
} & PickersDayProps<Dayjs>;

const attendanceColours: Record<AttendanceCodeType, string> = {
  [AttendanceCodeType.Present]: 'emerald',
  [AttendanceCodeType.ExplainedAbsence]: 'pink',
  [AttendanceCodeType.UnexplainedAbsence]: 'red',
  [AttendanceCodeType.Late]: 'sky',
  [AttendanceCodeType.NotTaken]: 'grey',
};

const weekends = [0, 6];

// const getCalendarColors = (
//   formattedDay: keyof typeof attendanceColours,
//   dayOfWeek: number,
// ) => {
//   if (weekends.includes(dayOfWeek)) {
//     return {
//       backgroundColor: 'white',
//       color: 'grey.300',
//     };
//   }
//
//   if (currentTabValue === 'ALL' || currentTabValue === formattedDay) {
//     const keyOfAttendanceColours = attendanceColours[formattedDay];
//
//     return {
//       backgroundColor: `${keyOfAttendanceColours}.100`,
//       color: `${keyOfAttendanceColours}.500`,
//     };
//   }
//
//   return {
//     backgroundColor: 'transparent',
//     color: 'grey.300',
//   };
// };

function CustomDay(props: CustomDayProps) {
  const { day, onDaySelect, bellTimes, ...other } = props;

  const dayToCheck = dayjs(day).format('YYYY-MM-DD');
  const dayOfWeek = dayjs(dayToCheck).day();
  const dayBellTime = bellTimes.find(
    (bellTime) => bellTime.date === dayToCheck
  );

  // const { backgroundColor, color } = getCalendarColors(
  //   dayBellTime?.status ?? AttendanceCodeType.NotTaken,
  //   dayOfWeek,
  //   currentTabValue
  // );

  return (
    <PickersDay
      day={day}
      sx={{
        borderRadius: '13px',
        // backgroundColor,
        // color,
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
  bellTimes: CalendarDayBellTime[];
  activeAcademicNamespace?: AcademicNamespace;
};

export const SchoolCalendar = ({
  bellTimes,
  activeAcademicNamespace,
}: SchoolCalendarProps) => {
  const { isStaffUserHasAllPermissions } = usePermissions();
  const hasPermissionReadAndWriteAttendanceStudentCalendarView =
    isStaffUserHasAllPermissions([
      'ps:1:attendance:read_session_attendance_student_calendar_view',
      'ps:1:attendance:write_session_attendance_student_calendar_view',
    ]);

  const [sessionAttendanceToEdit, setSessionAttendanceToEdit] = useState<
    string | null
  >(null);

  const startDate = dayjs(activeAcademicNamespace?.startDate);
  const endDate = dayjs(activeAcademicNamespace?.endDate);
  const months = [];

  const diffInMonths = endDate.diff(startDate, 'month');
  const totalMonths = diffInMonths + 1;

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
        <MonthCalendar key={month} month={month} bellTimes={bellTimes} />
      ))}
    </Stack>
  );
};
