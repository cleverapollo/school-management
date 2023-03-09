import { useQuery } from '@tanstack/react-query';
import {
  CalendarEventFilter,
  graphql,
  gqlClient,
  queryClient,
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

export const timetableKeys = {
  all: (filter: CalendarEventFilter) =>
    ['calendar', 'timetable', filter] as const,
};

const timetableQuery = (filter: CalendarEventFilter) => ({
  queryKey: timetableKeys.all(filter),
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
