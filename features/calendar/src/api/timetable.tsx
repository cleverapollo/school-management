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

const timetable = graphql(/* GraphQL */ `
  query calendar_partyTimetable($filter: CalendarEventFilter!) {
    calendar_calendarEvents(filter: $filter) {
      eventId
      startTime
      endTime
      type
      attendees {
        type
        partyInfo {
          __typename
          partyId
          ... on Staff {
            person {
              title
              firstName
              lastName
              type
            }
          }
          ... on SubjectGroup {
            name
          }
        }
      }
      rooms {
        name
      }
    }
  }
`);

const timetableDayInfo = graphql(/* GraphQL */ `
  query timetableDayInfo($filter: CalendarDayInfoFilter) {
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

export const timetableKeys = {
  timetable: (filter: CalendarEventFilter) =>
    ['calendar', 'timetable', filter] as const,
  dayInfo: (filter: CalendarDayInfoFilter) =>
    ['calendar', 'timetable', 'day-info', filter] as const,
};

const timetableQuery = (filter: CalendarEventFilter) => ({
  queryKey: timetableKeys.timetable(filter),
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

  useEffect(() => {
    const formattedDateBefore = date.subtract(1, 'day').format('YYYY-MM-DD');
    const formattedDateAfter = date.add(1, 'day').format('YYYY-MM-DD');
    getPartyTimetable({
      partyIds: [partyId ?? 0],
      startDate: formattedDateBefore,
      endDate: formattedDateBefore,
    });
    getPartyTimetable({
      partyIds: [partyId ?? 0],
      startDate: formattedDateAfter,
      endDate: formattedDateAfter,
    });
  }, [formattedDate]);

  return useQuery({
    ...timetableQuery({
      partyIds: [partyId ?? 0],
      startDate: formattedDate,
      endDate: formattedDate,
    }),
    select: ({ calendar_calendarEvents }) => calendar_calendarEvents,
  });
}

const timetableDayInfoQuery = (filter: CalendarDayInfoFilter) => ({
  queryKey: timetableKeys.dayInfo(filter),
  queryFn: async () => gqlClient.request(timetableDayInfo, { filter }),
  staleTime: 1000 * 60 * 60 * 24,
});

export function getTimetableDayInfo(filter: CalendarDayInfoFilter) {
  return queryClient.fetchQuery(timetableDayInfoQuery(filter));
}

export function useTimetableDayInfo(date: dayjs.Dayjs) {
  const formattedDate = date.format('YYYY-MM-DD');

  useEffect(() => {
    const formattedDateBefore = date.subtract(1, 'day').format('YYYY-MM-DD');
    const formattedDateAfter = date.add(1, 'day').format('YYYY-MM-DD');
    getTimetableDayInfo({
      fromDate: formattedDateBefore,
      toDate: formattedDateBefore,
    });
    getTimetableDayInfo({
      fromDate: formattedDateAfter,
      toDate: formattedDateAfter,
    });
  }, [formattedDate]);

  return useQuery({
    ...timetableDayInfoQuery({
      fromDate: formattedDate,
      toDate: formattedDate,
    }),
    select: ({ calendar_dayInfo }) =>
      calendar_dayInfo.length > 0 ? calendar_dayInfo[0] : undefined,
  });
}
