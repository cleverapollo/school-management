import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  StudentSessionAttendanceFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { attendanceKeys } from './keys';

const studentSessionAttendance = graphql(/* GraphQL */ `
  query studentSessionAttendance($filter: StudentSessionAttendanceFilter) {
    attendance_studentSessionAttendance(filter: $filter) {
      dateAttendance {
        date
        bellTimeAttendance {
          bellTimeId
          bellTime {
            time
            name
          }
          attendanceCode {
            id
            name
            description
            code
            codeType
          }
          note
          createdBy {
            partyId
            firstName
            lastName
            avatarUrl
          }
          createdByPartyId
          updatedBy {
            firstName
            lastName
            partyId
            avatarUrl
          }
          updatedByPartyId
        }
      }
      studentPartyId
      student {
        person {
          partyId
          firstName
          lastName
        }
      }
      classGroup {
        name
        staff {
          partyId
          firstName
          lastName
        }
      }
    }
  }
`);

const attendanceQuery = (filter: StudentSessionAttendanceFilter) => ({
  queryKey: attendanceKeys.individualStudentSessionAttendance(filter),
  queryFn: async () =>
    gqlClient.request(studentSessionAttendance, {
      filter,
    }),
});

export function getAttendanceQuery(filter: StudentSessionAttendanceFilter) {
  return queryClient.fetchQuery(attendanceQuery(filter));
}

export function useStudentSessionAttendance(
  filter: StudentSessionAttendanceFilter
) {
  return useQuery({
    ...attendanceQuery(filter),
    select: ({ attendance_studentSessionAttendance }) =>
      attendance_studentSessionAttendance[0]?.dateAttendance[0]
        ?.bellTimeAttendance,
  });
}

export type ReturnTypeFromUseStudentSessionAttendance = UseQueryReturnType<
  typeof useStudentSessionAttendance
>;
