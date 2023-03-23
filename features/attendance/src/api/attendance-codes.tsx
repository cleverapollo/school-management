import { useQuery } from '@tanstack/react-query';

import {
  AttendanceCodeFilter,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';

const attendanceCodes = graphql(/* GraphQL */ `
  query attendance_attendanceCodes($filter: AttendanceCodeFilter) {
    attendance_attendanceCodes(filter: $filter) {
      id
      name
      codeType
    }
  }
`);

const attendanceCodesKeys = {
  list: ['attendance', 'codes'] as const,
};

const attendanceCodesQuery = (filter: AttendanceCodeFilter) => ({
  queryKey: attendanceCodesKeys.list,
  queryFn: () => gqlClient.request(attendanceCodes, { filter }),
  staleTime: 1000 * 60 * 20,
});

export function useAttendanceCodes(filter: AttendanceCodeFilter) {
  return useQuery({
    ...attendanceCodesQuery(filter),
    select: ({ attendance_attendanceCodes }) => attendance_attendanceCodes,
  });
}

export function getAttendanceCodes(filter: AttendanceCodeFilter) {
  return queryClient.fetchQuery(attendanceCodesQuery(filter));
}
