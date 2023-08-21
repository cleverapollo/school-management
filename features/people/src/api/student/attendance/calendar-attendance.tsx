import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  CalendarAttendanceFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { peopleKeys } from '../../keys';

const calendarAttendance = graphql(/* GraphQL */ `
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

const calendarAttendanceQuery = (filter: CalendarAttendanceFilter) => ({
  queryKey: peopleKeys.students.calendarAttendance(filter),
  queryFn: async () => gqlClient.request(calendarAttendance, { filter }),
});

export function getCalendarAttendance(filter: CalendarAttendanceFilter) {
  return queryClient.fetchQuery(calendarAttendanceQuery(filter));
}

export function useCalendarAttendance(filter: CalendarAttendanceFilter) {
  return useQuery({
    ...calendarAttendanceQuery(filter),
    select: ({ attendance_calendarAttendance }) =>
      attendance_calendarAttendance,
    onError: (error) => {
      console.error('Error fetching calendnar events:', error);
    },
  });
}

export type ReturnTypeFromUseCalendarAttendance = UseQueryReturnType<
  typeof useCalendarAttendance
>;
