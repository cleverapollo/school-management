import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  SessionAttendanceReportFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { attendanceKeys } from './keys';

export type ReturnTypeFromUseSessionAttendanceList = UseQueryReturnType<
  typeof useSessionAttendanceList
>[number];

const sessionAttendanceListRequest = graphql(/* GraphQL */ `
  query attendance_sessionAttendanceReport(
    $filter: SessionAttendanceReportFilter
  ) {
      attendance_sessionAttendanceReport(filter: $filter) {
      id
      attendanceCode {
        code
        name
      }
      bellTime {
          time: Time!
          name: String
      }     
      attendanceCodeId
      contactPartyId
      from
      parentNote
          ss
      requestType
      status
      studentPartyId
      to
      classGroup {
        name
      }
      date
    }
  }
`);

const sessionListQuery = (filter: SessionAttendanceReportFilter) => ({
  queryKey: attendanceKeys.sessionAttendanceList(filter),
  queryFn: () => gqlClient.request(sessionAttendanceListRequest, { filter }),
});

export function useSessionAttendanceList(
  filter: SessionAttendanceReportFilter
) {
  return useQuery({
    ...sessionListQuery(filter),
    select: ({ attendance_sessionAttendanceReport }) =>
      attendance_sessionAttendanceReport,
  });
}

export function getAbsentRequests(filter: SessionAttendanceReportFilter) {
  return queryClient.fetchQuery(sessionListQuery(filter));
}
