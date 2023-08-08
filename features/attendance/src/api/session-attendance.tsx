import { useQuery } from '@tanstack/react-query';
import {
  AttendanceCodeType,
  gqlClient,
  graphql,
  queryClient,
  StudentSessionAttendanceFilter,
  UseQueryReturnType,
} from '@tyro/api';
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
    select: (data) =>
      (data.attendance_studentSessionAttendance ?? []).map((attendance) => {
        const attendanceByKey = attendance?.dateAttendance?.reduce<
          Record<string, string | null>
        >((acc, dateAttendance) => {
          const { date, bellTimeAttendance = [] } = dateAttendance ?? {};
          bellTimeAttendance?.forEach((bellTimeAttendanceValue) => {
            const { bellTimeId, attendanceCode } =
              bellTimeAttendanceValue ?? {};
            if (date && bellTimeId && attendanceCode?.id) {
              acc[`${date}-${bellTimeId}`] = attendanceCode.name;
            }
          });
          return acc;
        }, {});

        return {
          ...attendance,
          attendanceByKey,
        };
      }),
  });
}

export function getSessionAttendance(filter: StudentSessionAttendanceFilter) {
  return queryClient.fetchQuery(sessionAttendanceQuery(filter));
}

export type ReturnTypeFromSessionAttendance = UseQueryReturnType<
  typeof useSessionAttendance
>[number];
