import {
  Attendance_BulkAttendanceActionFilter,
  AttendanceCodeFilter,
  CalendarAttendanceFilter,
  CalendarDayBellTimeFilter,
  CalendarEventFilter,
  StudentSessionAttendanceFilter,
  ParentalAttendanceRequestFilter,
  SessionAttendanceListFilter,
} from '@tyro/api';

export const attendanceKeys = {
  all: ['attendance'] as const,
  codes: (filter: AttendanceCodeFilter) =>
    [...attendanceKeys.all, 'codes', filter] as const,
  sessionPartySearch: (query: string) =>
    [...attendanceKeys.all, 'sessionPartySearch', query] as const,
  sessionAttendance: (filter: StudentSessionAttendanceFilter) =>
    [...attendanceKeys.all, 'sessionAttendance', filter] as const,
  absentRequests: (filter: ParentalAttendanceRequestFilter) =>
    [...attendanceKeys.all, 'absentRequests', filter] as const,
  sessionAttendanceList: (filter: SessionAttendanceListFilter) =>
    [...attendanceKeys.all, 'sessionAttendanceList', filter] as const,
  individualStudentSessionAttendance: (
    filter: StudentSessionAttendanceFilter
  ) =>
    [
      ...attendanceKeys.all,
      'individualStudentSessionAttendance',
      filter,
    ] as const,
  studentCalendarAttendance: (filter: CalendarAttendanceFilter) =>
    [...attendanceKeys.all, 'studentCalendarAttendance', filter] as const,
  studentDailyCalendarTimetableInformation: (filter: CalendarEventFilter) =>
    [
      ...attendanceKeys.all,
      'studentDailyCalendarTimetableInformation',
      filter,
    ] as const,
  tableSessionAttendance: (filter: StudentSessionAttendanceFilter) =>
    [...attendanceKeys.all, 'tableSessionAttendance', filter] as const,
  calendarBellTimes: (filter: CalendarDayBellTimeFilter) =>
    [...attendanceKeys.all, 'calendarBellTimes', filter] as const,
  bulkAttendance: (filter: Attendance_BulkAttendanceActionFilter) =>
    [...attendanceKeys.all, 'bulkAttendance', filter] as const,
  bulkAttendanceSearch: (query: string) =>
    [...attendanceKeys.all, 'bulkAttendanceSearch', query] as const,
};
