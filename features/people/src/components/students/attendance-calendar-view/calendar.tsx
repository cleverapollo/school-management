import React, { useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { AcademicNamespace } from '@tyro/api';
import { ReturnTypeFromUseStudentCalendarAttendance } from '../../../api/student/attendance/calendar-attendance';
import {
  useAttendanceQuery,
  ReturnTypeFromUseStudentSessionAttendance,
} from '../../../api/student/attendance/student-session-attendance';
import { AttendanceDetailsModal } from './attendance-details-modal';

dayjs.extend(isToday);

type MonthCalendarProps = {
  month: string;
  attendance?: ReturnTypeFromUseStudentSessionAttendance;
  calendarAttendance?: ReturnTypeFromUseStudentCalendarAttendance;
  handleAddAttendance: (arg0: string) => void;
};

type CustomDayProps = {
  attendance?: ReturnTypeFromUseStudentSessionAttendance;
  handleAddAttendance: (arg0: string) => void;
  calendarAttendance?: ReturnTypeFromUseStudentCalendarAttendance;
} & PickersDayProps<Dayjs>;

const attendanceColours = {
  PRESENT: 'emerald',
  EXPLAINED_ABSENCE: 'pink',
  UNEXPLAINED_ABSENCE: 'red',
  LATE: 'sky',
  NOT_TAKEN: 'grey',
};

const weekends = [0, 6];

const getBackgroundColor = (formattedDay: string, dayOfWeek: number) => {
  if (weekends.includes(dayOfWeek)) {
    return 'white';
  }

  if (
    formattedDay &&
    attendanceColours[formattedDay as keyof typeof attendanceColours]
  ) {
    return `${
      attendanceColours[formattedDay as keyof typeof attendanceColours]
    }.100`;
  }

  return 'transparent';
};

const getFontColor = (formattedDay: string, dayOfWeek: number) => {
  if (weekends.includes(dayOfWeek)) {
    return 'grey.300';
  }
  if (
    formattedDay &&
    attendanceColours[formattedDay as keyof typeof attendanceColours]
  ) {
    return `${
      attendanceColours[formattedDay as keyof typeof attendanceColours]
    }.500`;
  }
};

function getCurrentDay(day: string) {
  return day;
}

function CustomDay(props: CustomDayProps) {
  const {
    day,
    attendance,
    onDaySelect,
    handleAddAttendance,
    calendarAttendance,
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
          dayOfWeek
        ),
        color: getFontColor(dayAttendance?.status ?? 'NOT_TAKEN', dayOfWeek),
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
  attendance,
  handleAddAttendance,
  calendarAttendance,
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
              attendance: attendance ?? [],
              handleAddAttendance,
              calendarAttendance,
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
};

export const AcademicCalendar = ({
  studentPartyId,
  calendarAttendance,
  activeAcademicNamespace,
}: AcademicCalendarProps) => {
  const { id } = useParams();

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

  const { data: attendance } = useAttendanceQuery({
    partyIds: [Number(id) ?? 0],
    from: activeAcademicNamespace?.startDate ?? '',
    to: activeAcademicNamespace?.endDate ?? '',
  });

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
            attendance={attendance}
            calendarAttendance={calendarAttendance}
            handleAddAttendance={setSessionAttendanceToEdit}
          />
        ))}
      </Stack>
      {sessionAttendanceToEdit && (
        <AttendanceDetailsModal
          open
          onClose={() => setSessionAttendanceToEdit(null)}
          day={sessionAttendanceToEdit}
          studentId={Number(studentPartyId) ?? 0}
        />
      )}
    </>
  );
};
