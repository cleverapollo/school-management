import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { AcademicNamespace } from '@tyro/api';
import { ReturnTypeFromUseStudentCalendarAttendance } from '../../../api/student/attendance/calendar-attendance';
import { AttendanceDetailsModal } from './attendance-details-modal';

dayjs.extend(isToday);

type MonthCalendarProps = {
  month: string;
  calendarAttendance?: ReturnTypeFromUseStudentCalendarAttendance;
  handleAddAttendance: (arg0: string) => void;
  currentTabValue: string;
};

type CustomDayProps = {
  handleAddAttendance: (arg0: string) => void;
  calendarAttendance?: ReturnTypeFromUseStudentCalendarAttendance;
  currentTabValue: string;
} & PickersDayProps<Dayjs>;

const attendanceColours = {
  PRESENT: 'emerald',
  EXPLAINED_ABSENCE: 'pink',
  UNEXPLAINED_ABSENCE: 'red',
  LATE: 'sky',
  NOT_TAKEN: 'grey',
};

const weekends = [0, 6];

const getBackgroundColor = (
  formattedDay: keyof typeof attendanceColours,
  dayOfWeek: number,
  currentTabValue: string
) => {
  if (weekends.includes(dayOfWeek)) {
    return 'white';
  }

  const keyOfAttendanceColours = attendanceColours[formattedDay];

  if (currentTabValue === 'All') {
    if (formattedDay && keyOfAttendanceColours) {
      return `${keyOfAttendanceColours}.100`;
    }
  } else if (currentTabValue === formattedDay) {
    return `${keyOfAttendanceColours}.100`;
  }

  return 'transparent';
};

const getFontColor = (
  formattedDay: keyof typeof attendanceColours,
  dayOfWeek: number,
  currentTabValue: string
) => {
  if (weekends.includes(dayOfWeek)) {
    return 'grey.300';
  }
  const keyOfAttendanceColours = attendanceColours[formattedDay];
  if (currentTabValue === 'All') {
    if (formattedDay && keyOfAttendanceColours) {
      return `${keyOfAttendanceColours}.500`;
    }
  } else if (currentTabValue === formattedDay) {
    return `${keyOfAttendanceColours}.500`;
  }
  return 'grey.300';
};

function getCurrentDay(day: string) {
  return day;
}

function CustomDay(props: CustomDayProps) {
  const {
    day,
    onDaySelect,
    handleAddAttendance,
    calendarAttendance,
    currentTabValue,
    ...other
  } = props;

  const dayToCheck = dayjs(day).format('YYYY-MM-DD');
  const dayOfWeek = dayjs(dayToCheck).day();
  const dayAttendance = calendarAttendance?.attendances?.find(
    (attendanceItem) => attendanceItem.date === dayToCheck
  );

  return (
    <PickersDay
      day={day}
      sx={{
        borderRadius: '13px',
        backgroundColor: getBackgroundColor(
          dayAttendance?.status ?? 'NOT_TAKEN',
          dayOfWeek,
          currentTabValue
        ),
        color: getFontColor(
          dayAttendance?.status ?? 'NOT_TAKEN',
          dayOfWeek,
          currentTabValue
        ),
      }}
      onDaySelect={() => {
        handleAddAttendance(dayjs(day).format('YYYY-MM-DD'));
        getCurrentDay(dayjs(day).format('YYYY-MM-DD'));
      }}
      {...other}
    />
  );
}

function MonthCalendar({
  month,
  handleAddAttendance,
  calendarAttendance,
  currentTabValue,
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
              handleAddAttendance,
              calendarAttendance,
              currentTabValue,
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

type AcademicCalendarProps = {
  studentPartyId: string;
  calendarAttendance?: ReturnTypeFromUseStudentCalendarAttendance;
  activeAcademicNamespace?: AcademicNamespace;
  currentTabValue: string;
};

export const AcademicCalendar = ({
  studentPartyId,
  calendarAttendance,
  activeAcademicNamespace,
  currentTabValue,
}: AcademicCalendarProps) => {
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
    <>
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
            calendarAttendance={calendarAttendance}
            currentTabValue={currentTabValue}
            handleAddAttendance={setSessionAttendanceToEdit}
          />
        ))}
      </Stack>
      {sessionAttendanceToEdit && (
        <AttendanceDetailsModal
          day={sessionAttendanceToEdit}
          studentId={Number(studentPartyId) ?? 0}
          onClose={() => setSessionAttendanceToEdit(null)}
        />
      )}
    </>
  );
};
