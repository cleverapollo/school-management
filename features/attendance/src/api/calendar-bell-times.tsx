import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  CalendarDayBellTimeFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { attendanceKeys } from './keys';

const calendarBellTimes = graphql(/* GraphQL */ `
  query calendar_calendarDayBellTimes($filter: CalendarDayBellTimeFilter) {
    calendar_calendarDayBellTimes(filter: $filter) {
      date
      bellTimeIds
      bellTimes {
        id
        time
        name
      }
    }
  }
`);

const bellTimesQuery = (filter: CalendarDayBellTimeFilter) => ({
  queryKey: attendanceKeys.calendarBellTimes(filter),
  queryFn: async () => gqlClient.request(calendarBellTimes, { filter }),
});

export function getBellTimesQuery(filter: CalendarDayBellTimeFilter) {
  return queryClient.fetchQuery(bellTimesQuery(filter));
}

export function useBellTimesQuery(filter: CalendarDayBellTimeFilter) {
  return useQuery({
    ...bellTimesQuery(filter),
    select: ({ calendar_calendarDayBellTimes }) =>
      calendar_calendarDayBellTimes[0]?.bellTimes,
  });
}

export type ReturnTypeFromUseCalendarBellTimes = UseQueryReturnType<
  typeof useBellTimesQuery
>;
