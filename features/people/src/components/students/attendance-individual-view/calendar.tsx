import { useState, useMemo } from 'react';
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

type CustomDayProps = {
  handleAddAttendance: (arg0: string) => void;
  calendarAttendanceMap: Map<
    string,
    Omit<
      ReturnTypeFromUseStudentCalendarAttendance['attendances'][number],
      'status'
    > & {
      status: AttendanceCodeType;
    }
  >;
  currentTabValue: AttendanceDataType['currentTabValue'];
  hasPermissionReadAndWriteAttendanceStudentCalendarView: boolean;
  startDate: dayjs.Dayjs;
  isPartialAbsenceEnabled: boolean;
} & PickersDayProps<Dayjs>;

type MonthCalendarProps = {
  month: string;
  calendarAttendanceMap: CustomDayProps['calendarAttendanceMap'];
  handleAddAttendance: (arg0: string) => void;
  currentTabValue: AttendanceDataType['currentTabValue'];
  hasPermissionReadAndWriteAttendanceStudentCalendarView: boolean;
  startDate: dayjs.Dayjs;
  isPartialAbsenceEnabled: boolean;
};

const defaultColors = {
  bgColor: 'transparent',
  color: 'slate.500',
  hoverBg: 'transparent',
} as const;

const getCalendarColors = ({
  currentTabValue,
  dayAttendance,
  isPartialAbsenceEnabled,
}: {
  currentTabValue: AttendanceDataType['currentTabValue'];
  dayAttendance: ReturnType<MonthCalendarProps['calendarAttendanceMap']['get']>;
  isPartialAbsenceEnabled: boolean;
}) => {
  if (!dayAttendance || dayjs(dayAttendance.date).isAfter(dayjs())) {
    return defaultColors;
  }

  const attendanceCode = dayAttendance.status;
  const isPartialAbsence = dayAttendance.partiallyTaken;

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
    calendarAttendanceMap,
    currentTabValue,
    hasPermissionReadAndWriteAttendanceStudentCalendarView,
    startDate,
    isPartialAbsenceEnabled,
    ...other
  } = props;

  const dayToCheck = dayjs(day).format('YYYY-MM-DD');
  const dayAttendance = calendarAttendanceMap.get(dayToCheck);

  const { bgColor, color, hoverBg } = getCalendarColors({
    currentTabValue,
    dayAttendance,
    isPartialAbsenceEnabled,
  });

  const canClickDay =
    hasPermissionReadAndWriteAttendanceStudentCalendarView && !!dayAttendance;

  return (
    <PickersDay
      day={day}
      sx={{
        pointerEvents: canClickDay ? undefined : 'none',
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
      selected={false}
    />
  );
}

function MonthCalendar({
  month,
  handleAddAttendance,
  calendarAttendanceMap,
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
        defaultValue={dayjs(month)}
        disableHighlightToday
        slots={{
          day: (props) =>
            CustomDay({
              ...props,
              handleAddAttendance,
              calendarAttendanceMap,
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

export type AcademicCalendarProps = {
  studentPartyId: string;
  calendarAttendance: Exclude<
    ReturnType<MonthCalendarProps['calendarAttendanceMap']['get']>,
    undefined
  >[];
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

  const calendarAttendanceMap = useMemo(
    () =>
      calendarAttendance.reduce<MonthCalendarProps['calendarAttendanceMap']>(
        (acc, attendance) => {
          acc.set(attendance.date, attendance);
          return acc;
        },
        new Map()
      ),
    [calendarAttendance]
  );

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
            calendarAttendanceMap={calendarAttendanceMap}
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
