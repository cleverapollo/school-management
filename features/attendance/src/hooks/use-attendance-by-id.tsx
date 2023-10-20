import { useMemo } from 'react';
import { AttendanceCodeFilter } from '@tyro/api';
import {
  ReturnTypeFromUseAttendanceCodes,
  useAttendanceCodes,
} from '../api/attendance-codes';

type AttendanceByIds = Record<
  ReturnTypeFromUseAttendanceCodes['id'],
  ReturnTypeFromUseAttendanceCodes
>;

export const useAttendanceCodeById = (filter: AttendanceCodeFilter) => {
  const { data: attendanceCodes = [] } = useAttendanceCodes(filter);

  const codeById = useMemo<AttendanceByIds | null>(() => {
    if (attendanceCodes.length === 0) return null;
    return attendanceCodes.reduce<AttendanceByIds>(
      (ids, code) => ({
        ...ids,
        [code.id]: code,
      }),
      {}
    );
  }, [attendanceCodes]);

  return codeById;
};
