import {
  AttendanceCodeFilter,
  StudentSessionAttendanceFilter,
} from '@tyro/api';

export const attendanceKeys = {
  all: ['attendance'] as const,
  codes: (filter: AttendanceCodeFilter) =>
    [...attendanceKeys.all, 'codes', filter] as const,
  sessionPartySearch: (query: string) =>
    [...attendanceKeys.all, 'sessionPartySearch', query] as const,
  sessionAttendance: (filter: StudentSessionAttendanceFilter) =>
    [...attendanceKeys.all, 'sessionAttendance', filter] as const,
};
