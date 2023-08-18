import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  CalendarDayBellTimeFilter,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { calendarKeys } from './keys';

const calendarDayBellTimes = graphql(/* GraphQL */ `
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

const calendarDayBellTimesQuery = (filter: CalendarDayBellTimeFilter) => ({
  queryKey: calendarKeys.calendarDayBellTimes(filter),
  queryFn: async () =>
    gqlClient.request(calendarDayBellTimes, {
      filter,
    }),
});

export function getCalendarDayBellTimes(filter: CalendarDayBellTimeFilter) {
  return queryClient.fetchQuery(calendarDayBellTimesQuery(filter));
}

export function useCalendarDayBellTimes(filter: CalendarDayBellTimeFilter) {
  return useQuery({
    ...calendarDayBellTimesQuery(filter),
    select: ({ calendar_calendarDayBellTimes }) =>
      calendar_calendarDayBellTimes,
  });
}

export type ReturnTypeFromCalendarDayBellTimes = UseQueryReturnType<
  typeof useCalendarDayBellTimes
>;
