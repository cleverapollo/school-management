import { useQuery } from '@tanstack/react-query';
import {
  Attendance_StudentSessionAttendanceQuery,
  gqlClient,
  graphql,
  queryClient,
  StudentSessionAttendanceFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { useCallback } from 'react';
import { attendanceKeys } from './keys';

const sessionAttendance = graphql(/* GraphQL */ `
  query attendance_studentSessionAttendance(
    $filter: StudentSessionAttendanceFilter
  ) {
    attendance_studentSessionAttendance(filter: $filter) {
      studentPartyId
      student {
        partyId
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        avatarUrl
        type
      }
      classGroup {
        name
      }
      dateAttendance {
        date
        bellTimeAttendance {
          bellTimeId
          attendanceCode {
            id
            name
            codeType
          }
          note
        }
      }
    }
  }
`);

const sessionAttendanceQuery = (filter: StudentSessionAttendanceFilter) => ({
  queryKey: attendanceKeys.sessionAttendance(filter),
  queryFn: () => gqlClient.request(sessionAttendance, { filter }),
});

export function useSessionAttendance(filter: StudentSessionAttendanceFilter) {
  return useQuery({
    ...sessionAttendanceQuery(filter),
    select: useCallback(
      (data: Attendance_StudentSessionAttendanceQuery) =>
        (data.attendance_studentSessionAttendance ?? []).map((attendance) => {
          const noteByKey: Record<string, string | null> = {};
          const attendanceByKey: Record<string, string | null> = {};

          attendance?.dateAttendance?.forEach((dateAttendance) => {
            const { date, bellTimeAttendance = [] } = dateAttendance ?? {};
            bellTimeAttendance?.forEach((bellTimeAttendanceValue) => {
              const { bellTimeId, attendanceCode } =
                bellTimeAttendanceValue ?? {};
              if (date && bellTimeId && attendanceCode?.id) {
                if (attendanceCode?.id) {
                  attendanceByKey[`${date}-${bellTimeId}`] =
                    attendanceCode.name;
                }

                if (bellTimeAttendanceValue?.note) {
                  noteByKey[`${date}-${bellTimeId}`] =
                    bellTimeAttendanceValue.note;
                }
              }
            });
          });

          return {
            ...attendance,
            attendanceByKey,
            noteByKey,
          };
        }),
      []
    ),
  });
}

export function getSessionAttendance(filter: StudentSessionAttendanceFilter) {
  return queryClient.fetchQuery(sessionAttendanceQuery(filter));
}

export type ReturnTypeFromSessionAttendance = UseQueryReturnType<
  typeof useSessionAttendance
>[number];
