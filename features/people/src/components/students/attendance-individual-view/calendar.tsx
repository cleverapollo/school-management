import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import {
  AcademicNamespace,
  AttendanceCodeType,
  usePermissions,
} from '@tyro/api';
import { ReturnTypeFromUseStudentCalendarAttendance } from '@tyro/attendance';
import { getColourBasedOnAttendanceType } from '@tyro/core';
import { AttendanceDetailsModal } from './attendance-details-modal';
import { AttendanceDataType } from './index';

dayjs.extend(isToday);

type MonthCalendarProps = {
  month: string;
  calendarAttendance?: ReturnTypeFromUseStudentCalendarAttendance;
  handleAddAttendance: (arg0: string) => void;
  currentTabValue: AttendanceDataType['currentTabValue'];
  hasPermissionReadAndWriteAttendanceStudentCalendarView: boolean;
  startDate: dayjs.Dayjs;
  isPartialAbsenceEnabled: boolean;
};

type CustomDayProps = {
  handleAddAttendance: (arg0: string) => void;
  calendarAttendance?: ReturnTypeFromUseStudentCalendarAttendance;
  currentTabValue: AttendanceDataType['currentTabValue'];
  hasPermissionReadAndWriteAttendanceStudentCalendarView: boolean;
  startDate: dayjs.Dayjs;
  isPartialAbsenceEnabled: boolean;
} & PickersDayProps<Dayjs>;

const weekends = [0, 6];

type GetCalendarColorsFn = (
  attendanceCode: AttendanceCodeType,
  dayOfWeek: number,
  currentTabValue: AttendanceDataType['currentTabValue'],
  dayToCheck: string,
  startDate: dayjs.Dayjs,
  isPartialAbsenceEnabled: boolean,
  isPartialAbsence?: boolean
) => ReturnType<typeof getColourBasedOnAttendanceType>['filled'];

const defaultColors: ReturnType<typeof getCalendarColors> = {
  bgColor: 'transparent',
  color: 'slate.500',
  hoverBg: 'transparent',
};

const getCalendarColors: GetCalendarColorsFn = (
  attendanceCode,
  dayOfWeek,
  currentTabValue,
  dayToCheck,
  startDate,
  isPartialAbsenceEnabled,
  isPartialAbsence
) => {
  const isAfterCurrentDay = dayjs().isBefore(dayToCheck);
  const isBeforeCurrentDay = dayjs(dayToCheck).isBefore(startDate);

  if (
    weekends.includes(dayOfWeek) ||
    isBeforeCurrentDay ||
    (isAfterCurrentDay && attendanceCode === AttendanceCodeType.NotTaken)
  ) {
    return defaultColors;
  }

  if (
    ['ALL', 'PARTIAL_ABSENCE'].includes(currentTabValue) &&
    isPartialAbsenceEnabled &&
    isPartialAbsence
  ) {
    return getColourBasedOnAttendanceType('PARTIAL_ABSENCE').filled;
  }

  if (currentTabValue === 'ALL' || currentTabValue === attendanceCode) {
    return getColourBasedOnAttendanceType(attendanceCode).filled;
  }

  return defaultColors;
};

function CustomDay(props: CustomDayProps) {
  const {
    day,
    onDaySelect,
    handleAddAttendance,
    calendarAttendance,
    currentTabValue,
    hasPermissionReadAndWriteAttendanceStudentCalendarView,
    startDate,
    isPartialAbsenceEnabled,
    ...other
  } = props;

  const dayToCheck = dayjs(day).format('YYYY-MM-DD');
  const dayOfWeek = dayjs(dayToCheck).day();
  const dayAttendance = calendarAttendance?.attendances?.find(
    (attendanceItem) => attendanceItem.date === dayToCheck
  );

  const isPartialAbsence = dayAttendance?.partiallyTaken;
  const { bgColor, color, hoverBg } = getCalendarColors(
    dayAttendance?.status ?? AttendanceCodeType.NotTaken,
    dayOfWeek,
    currentTabValue,
    dayToCheck,
    startDate,
    isPartialAbsenceEnabled,
    isPartialAbsence
  );

  return (
    <PickersDay
      day={day}
      sx={{
        pointerEvents: hasPermissionReadAndWriteAttendanceStudentCalendarView
          ? undefined
          : 'none',
        borderRadius: '13px',
        backgroundColor: bgColor,
        color,
        '&:hover': {
          backgroundColor: hoverBg,
          color,
        },
      }}
      onDaySelect={() => {
        handleAddAttendance(dayjs(day).format('YYYY-MM-DD'));
        dayjs(day).format('YYYY-MM-DD');
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
  hasPermissionReadAndWriteAttendanceStudentCalendarView,
  startDate,
  isPartialAbsenceEnabled,
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
              hasPermissionReadAndWriteAttendanceStudentCalendarView,
              startDate,
              isPartialAbsenceEnabled,
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
            fontWeight: '700',
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
  currentTabValue: AttendanceDataType['currentTabValue'];
  isPartialAbsenceEnabled: boolean;
};

export const AcademicCalendar = ({
  studentPartyId,
  calendarAttendance,
  activeAcademicNamespace,
  currentTabValue,
  isPartialAbsenceEnabled,
}: AcademicCalendarProps) => {
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
            hasPermissionReadAndWriteAttendanceStudentCalendarView={
              hasPermissionReadAndWriteAttendanceStudentCalendarView
            }
            startDate={startDate}
            isPartialAbsenceEnabled={isPartialAbsenceEnabled}
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
