import { useQuery } from '@tanstack/react-query';
import {
  CalendarEventIteratorFilter,
  gqlClient,
  graphql,
  Iterator,
  queryClient,
} from '@tyro/api';

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

export async function fetchSubjectGroupLesson(
  filter: CalendarEventIteratorFilter
) {
  const queryData = await queryClient.fetchQuery(
    subjectGroupLessonQuery(filter)
  );

  if (!queryData.calendar_calendarEventsIterator) return null;

  const eventStartTime = queryData.calendar_calendarEventsIterator.startTime;

  return Promise.all([
    queryClient.fetchQuery(
      subjectGroupLessonQuery({
        ...filter,
        iterator: Iterator.Previous,
        eventStartTime,
      })
    ),
    queryClient.fetchQuery(
      subjectGroupLessonQuery({
        ...filter,
        iterator: Iterator.Next,
        eventStartTime,
      })
    ),
  ]);
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
  fetchSubjectGroupLesson(filter);

  return useQuery({
    ...subjectGroupLessonQuery(filter),
    select: ({ calendar_calendarEventsIterator }) =>
      calendar_calendarEventsIterator,
  });
}
