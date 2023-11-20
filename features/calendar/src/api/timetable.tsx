import { useQuery } from '@tanstack/react-query';
import {
  CalendarEventFilter,
  graphql,
  gqlClient,
  queryClient,
  CalendarDayInfoFilter,
} from '@tyro/api';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { calendarKeys } from './keys';
import { getCalendarEvents } from './events';

const timetable = graphql(/* GraphQL */ `
  query calendar_partyTimetable($filter: CalendarEventFilter!) {
    calendar_calendarEvents(filter: $filter) {
      resources {
        resourceId
        events {
          eventId
          name
          startTime
          endTime
          type
          colour
          attendees {
            type
            partyInfo {
              __typename
              partyId
              ... on Staff {
                person {
                  title {
                    id
                    name
                    nameTextId
                  }
                  firstName
                  lastName
                  type
                }
              }
              ... on SubjectGroup {
                name
                actualName
              }
            }
          }
          rooms {
            name
          }
          tags {
            label
            context
          }
        }
      }
    }
  }
`);

const timetableInfo = graphql(/* GraphQL */ `
  query timetableInfo($filter: CalendarDayInfoFilter) {
    calendar_dayInfo(filter: $filter) {
      date
      startTime
      endTime
      dayType
      periods {
        startTime
        endTime
        type
      }
    }
  }
`);

const timetableQuery = (filter: CalendarEventFilter) => ({
  queryKey: calendarKeys.timetable(filter),
  queryFn: async () => gqlClient.request(timetable, { filter }),
});

export function getPartyTimetable(filter: CalendarEventFilter) {
  return queryClient.fetchQuery(timetableQuery(filter));
}

export function usePartyTimetable({
  date,
  partyId,
}: {
  date: dayjs.Dayjs;
  partyId: number | undefined;
}) {
  const formattedDate = date.format('YYYY-MM-DD');

  return useQuery({
    ...timetableQuery({
      resources: {
        partyIds: [partyId ?? 0],
      },
      startDate: formattedDate,
      endDate: formattedDate,
    }),
    select: ({ calendar_calendarEvents }) => {
      const resource =
        calendar_calendarEvents?.resources &&
        calendar_calendarEvents.resources.length > 0
          ? calendar_calendarEvents.resources[0]
          : null;
      return resource?.events ?? [];
    },
  });
}

export const timetableInfoQuery = (filter: CalendarDayInfoFilter) => ({
  queryKey: calendarKeys.dayInfo(filter),
  queryFn: async () => gqlClient.request(timetableInfo, { filter }),
  staleTime: 1000 * 60 * 60 * 24,
});

export function getTimetableInfo(filter: CalendarDayInfoFilter) {
  return queryClient.fetchQuery(timetableInfoQuery(filter));
}

export function getTimetableInfoForCalendar(date: Date) {
  const dayInfoFromDate = dayjs(date)
    .subtract(1, 'month')
    .startOf('month')
    .format('YYYY-MM-DD');
  const dayInfoToDate = dayjs(date)
    .add(1, 'month')
    .endOf('month')
    .format('YYYY-MM-DD');

  return getTimetableInfo({
    fromDate: dayInfoFromDate,
    toDate: dayInfoToDate,
  });
}

export function getTodayTimetableEvents(partyId: number | null | undefined) {
  const today = dayjs().toDate();

  const getEventsPromise = partyId
    ? getCalendarEvents({
        date: today,
        resources: {
          partyIds: [partyId],
        },
      })
    : null;

  return Promise.all([getEventsPromise, getTimetableInfoForCalendar(today)]);
}

export function useTimetableInfo(fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs) {
  return useQuery({
    ...timetableInfoQuery({
      fromDate: fromDate.format('YYYY-MM-DD'),
      toDate: toDate.format('YYYY-MM-DD'),
    }),
    select: ({ calendar_dayInfo }) => calendar_dayInfo,
  });
}

export function useTimetableDayInfo(date: dayjs.Dayjs) {
  const formattedDate = date.format('YYYY-MM-DD');

  useEffect(() => {
    const formattedDateBefore = date.subtract(1, 'day').format('YYYY-MM-DD');
    const formattedDateAfter = date.add(1, 'day').format('YYYY-MM-DD');
    getTimetableInfo({
      fromDate: formattedDateBefore,
      toDate: formattedDateBefore,
    });
    getTimetableInfo({
      fromDate: formattedDateAfter,
      toDate: formattedDateAfter,
    });
  }, [formattedDate]);

  return useQuery({
    ...timetableInfoQuery({
      fromDate: formattedDate,
      toDate: formattedDate,
    }),
    select: ({ calendar_dayInfo }) =>
      calendar_dayInfo.length > 0 ? calendar_dayInfo[0] : undefined,
  });
}
