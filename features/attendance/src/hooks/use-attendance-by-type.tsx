import { useMemo } from 'react';
import { AttendanceCodeFilter } from '@tyro/api';
import {
  ReturnTypeFromUseAttendanceCodes,
  useAttendanceCodes,
} from '../api/attendance-codes';

type AttendanceByCodeType = Record<
  ReturnTypeFromUseAttendanceCodes['codeType'],
  ReturnTypeFromUseAttendanceCodes
>;

export const useAttendanceCodeByType = (filter: AttendanceCodeFilter) => {
  const { data: attendanceCodes = [] } = useAttendanceCodes(filter);

  const codeByType = useMemo<AttendanceByCodeType | null>(() => {
    if (attendanceCodes.length === 0) return null;
    return attendanceCodes.reduce<AttendanceByCodeType>(
      (ids, code) => ({
        ...ids,
        [code.codeType]: code,
      }),
      {} as AttendanceByCodeType
    );
  }, [attendanceCodes]);

  return codeByType;
};
