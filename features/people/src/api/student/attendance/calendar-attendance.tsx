import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  CalendarAttendanceFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { peopleKeys } from '../../keys';

const studentCalendarAttendance = graphql(/* GraphQL */ `
  query attendance_calendarAttendance($filter: CalendarAttendanceFilter) {
    attendance_calendarAttendance(filter: $filter) {
      totalPresent
      totalLate
      totalAbsent
      totalUnexplained
      totalNotTaken
      attendances {
        date
        status
      }
    }
  }
`);

const studentCalendarAttendanceQuery = (filter: CalendarAttendanceFilter) => ({
  queryKey: peopleKeys.students.studentCalendarAttendance(filter),
  queryFn: async () => gqlClient.request(studentCalendarAttendance, { filter }),
});

export function getStudentCalendarAttendance(filter: CalendarAttendanceFilter) {
  return queryClient.fetchQuery(studentCalendarAttendanceQuery(filter));
}

export function useStudentCalendarAttendance(filter: CalendarAttendanceFilter) {
  return useQuery({
    ...studentCalendarAttendanceQuery(filter),
    select: ({ attendance_calendarAttendance }) =>
      attendance_calendarAttendance,
  });
}

export type ReturnTypeFromUseStudentCalendarAttendance = UseQueryReturnType<
  typeof useStudentCalendarAttendance
>;
