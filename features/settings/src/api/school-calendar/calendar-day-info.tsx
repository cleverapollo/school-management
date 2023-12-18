import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  CalendarFilter,
} from '@tyro/api';
import { schoolCalendarKeys } from './keys';

const calendarDayInfo = graphql(/* GraphQL */ `
  query calendarDayInfo($filter: CalendarFilter) {
    calendar_calendar(filter: $filter) {
      id
      dayInfo {
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
  }
`);

const calendarDayInfoQuery = (filter: CalendarFilter) => ({
  queryKey: schoolCalendarKeys.dayInfo(filter),
  queryFn: async () =>
    gqlClient.request(calendarDayInfo, {
      filter,
    }),
});

export function getCalendarDayInfo(filter: CalendarFilter) {
  return queryClient.fetchQuery(calendarDayInfoQuery(filter));
}

export function useCalendarDayInfo(filter: CalendarFilter) {
  return useQuery({
    ...calendarDayInfoQuery(filter),
    select: ({ calendar_calendar }) => calendar_calendar?.[0] ?? {},
  });
}

export type ReturnTypeFromCalendarDayInfo = UseQueryReturnType<
  typeof useCalendarDayInfo
>;
