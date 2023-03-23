import { useQuery } from '@tanstack/react-query';
import {
  CalendarEventIteratorFilter,
  gqlClient,
  graphql,
  Iterator,
  queryClient,
} from '@tyro/api';
import { useEffect } from 'react';

// Query for getting closest/prev/next lesson for a subject group
const subjectGroupLessonByIterator = graphql(/* GraphQL */ `
  query calendar_calendarEventsIterator($filter: CalendarEventIteratorFilter!) {
    calendar_calendarEventsIterator(filter: $filter) {
      eventId
      calendarIds
      startTime
      endTime
      type
      eventAttendance {
        eventId
        attendanceCodeId
        personPartyId
      }
      attendees {
        partyId
        type
        partyInfo {
          partyId
          ... on Staff {
            person {
              firstName
              lastName
              avatarUrl
            }
          }
        }
      }
      rooms {
        name
      }
    }
  }
`);

export const subjectGroupLessonKeys = {
  list: ['groups', 'subject', 'lesson'] as const,
  details: (filter: CalendarEventIteratorFilter) =>
    [...subjectGroupLessonKeys.list, filter] as const,
};

const subjectGroupLessonQuery = (filter: CalendarEventIteratorFilter) => ({
  queryKey: subjectGroupLessonKeys.details(filter),
  queryFn: () => gqlClient.request(subjectGroupLessonByIterator, { filter }),
});

export function getSubjectGroupLesson(filter: CalendarEventIteratorFilter) {
  return queryClient.fetchQuery(subjectGroupLessonQuery(filter));
}

export function useNextSubjectGroupLesson(filter: CalendarEventIteratorFilter) {
  const { data: closestLessonData } = useSubjectGroupLessonByIterator({
    ...filter,
    iterator: Iterator.Closest,
  });

  return useQuery({
    ...subjectGroupLessonQuery({
      ...filter,
      iterator: Iterator.Next,
      eventStartTime: closestLessonData?.startTime,
    }),
    enabled: !!closestLessonData?.eventId,
    select: ({ calendar_calendarEventsIterator }) =>
      calendar_calendarEventsIterator,
  });
}

export function useSubjectGroupLessonByIterator(
  filter: CalendarEventIteratorFilter
) {
  const queryData = useQuery({
    ...subjectGroupLessonQuery(filter),
    select: ({ calendar_calendarEventsIterator }) =>
      calendar_calendarEventsIterator,
  });

  useEffect(() => {
    if (queryData.data?.startTime) {
      getSubjectGroupLesson({
        partyId: filter.partyId,
        iterator: Iterator.Previous,
        eventStartTime: queryData.data.startTime,
      });
      getSubjectGroupLesson({
        partyId: filter.partyId,
        iterator: Iterator.Next,
        eventStartTime: queryData.data.startTime,
      });
    }
  }, [queryData.data?.startTime]);

  return queryData;
}
