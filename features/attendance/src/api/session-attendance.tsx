import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Attendance_StudentSessionAttendanceQuery,
  gqlClient,
  graphql,
  queryClient,
  SaveStudentSessionAttendanceInput,
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
        person {
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
        extensions {
          priority
        }
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

const saveSessionAttendance = graphql(/* GraphQL */ `
  mutation attendance_saveStudentSessionAttendance(
    $input: SaveStudentSessionAttendanceInput
  ) {
    attendance_saveStudentSessionAttendance(input: $input) {
      studentPartyId
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
                attendanceByKey[`${date}-${bellTimeId}`] = attendanceCode.name;

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

export function useSaveSessionAttendance() {
  return useMutation({
    mutationFn: (input: SaveStudentSessionAttendanceInput) =>
      gqlClient.request(saveSessionAttendance, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(attendanceKeys.all);
    },
  });
}

export type ReturnTypeFromSessionAttendance = UseQueryReturnType<
  typeof useSessionAttendance
>[number];
