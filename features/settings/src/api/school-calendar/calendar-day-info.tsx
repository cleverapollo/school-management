import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  CalendarDayInfoFilter,
} from '@tyro/api';
import { schoolCalendarKeys } from './keys';

const calendarDayInfo = graphql(/* GraphQL */ `
  query calendarDayInfo($filter: CalendarDayInfoFilter) {
    calendar_dayInfo(filter: $filter) {
      date
      dayType
      startTime
      endTime
      periods {
        type
        startTime
        endTime
      }
    }
  }
`);

const calendarDayInfoQuery = (filter: CalendarDayInfoFilter) => ({
  queryKey: schoolCalendarKeys.dayInfo(filter),
  queryFn: async () =>
    gqlClient.request(calendarDayInfo, {
      filter,
    }),
});

export function getCalendarDayInfo(filter: CalendarDayInfoFilter) {
  return queryClient.fetchQuery(calendarDayInfoQuery(filter));
}

export function useCalendarDayInfo(filter: CalendarDayInfoFilter) {
  return useQuery({
    ...calendarDayInfoQuery(filter),
    select: ({ calendar_dayInfo }) => calendar_dayInfo,
  });
}

export type ReturnTypeFromCalendarDayInfo = UseQueryReturnType<
  typeof useCalendarDayInfo
>;
