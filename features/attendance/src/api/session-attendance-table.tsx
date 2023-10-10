import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  SessionAttendanceListFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { attendanceKeys } from './keys';

export type ReturnTypeFromUseSessionAttendanceList = UseQueryReturnType<
  typeof useSessionAttendanceList
>[number];

const sessionAttendanceListRequest = graphql(/* GraphQL */ `
  query attendance_sessionAttendanceReport(
    $filter: SessionAttendanceListFilter
  ) {
    attendance_sessionAttendanceList(filter: $filter) {
      id
      studentPartyId
      attendanceCode {
        code
        name
      }
      student {
        person {
          partyId
          firstName
          lastName
          avatarUrl
          type
        }
        extensions {
          priority
        }
      }
      bellTime {
        time
        name
      }
      attendanceCodeId
      classGroup {
        name
      }
      date
      note
    }
  }
`);

const sessionListQuery = (filter: SessionAttendanceListFilter) => ({
  queryKey: attendanceKeys.sessionAttendanceList(filter),
  queryFn: () => gqlClient.request(sessionAttendanceListRequest, { filter }),
});

export function useSessionAttendanceList(filter: SessionAttendanceListFilter) {
  return useQuery({
    ...sessionListQuery(filter),
    select: ({ attendance_sessionAttendanceList }) =>
      attendance_sessionAttendanceList,
  });
}

export function getAbsentRequests(filter: SessionAttendanceListFilter) {
  return queryClient.fetchQuery(sessionListQuery(filter));
}
