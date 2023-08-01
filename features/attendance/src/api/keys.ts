import { ParentalAttendanceRequestFilter } from '@tyro/api';

export const attendanceKeys = {
  all: ['attendance'] as const,
  absentRequests: (filter: ParentalAttendanceRequestFilter) =>
    [...attendanceKeys.all, 'absentRequests', filter] as const,
};
