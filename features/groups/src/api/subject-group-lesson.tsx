import { useQuery } from '@tanstack/react-query';
import {
  CalendarEventIteratorFilter,
  gqlClient,
  graphql,
  Iterator,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { groupsKeys } from './keys';

// Query for getting closest/prev/next lesson for a subject group
const subjectGroupLessonByIterator = graphql(/* GraphQL */ `
  query calendar_calendarEventsIterator($filter: CalendarEventIteratorFilter!) {
    calendar_calendarEventsIterator_v2(filter: $filter) {
      event {
        eventId
        name
        colour
        calendarIds
        startTime
        endTime
        type
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
        extensions {
          eventAttendance {
            eventId
            note
            attendanceCodeId
            attendanceCode {
              name
              codeType
            }
            personPartyId
            adminSubmitted
            createdBy {
              firstName
              lastName
              type
            }
            updatedAt
            updatedBy {
              firstName
              lastName
              type
            }
          }
          previousEventAttendance {
            attendanceCode {
              codeType
            }
            personPartyId
          }
        }
      }
      eventsOnSameDayForSameGroup {
        eventId
        name
        colour
        type
        startTime
        endTime
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
`);

const subjectGroupLessonQuery = (filter: CalendarEventIteratorFilter) => ({
  queryKey: groupsKeys.subject.lesson(filter),
  queryFn: async () => {
    const { calendar_calendarEventsIterator_v2: eventData } =
      await gqlClient.request(subjectGroupLessonByIterator, { filter });

    const [lastUpdate] = (eventData?.event?.extensions?.eventAttendance || [])
      .filter((event) => !event?.adminSubmitted)
      .sort(
        (eventA, eventB) =>
          dayjs(eventB?.updatedAt).unix() - dayjs(eventA?.updatedAt).unix()
      );

    const additionalLessons = eventData?.eventsOnSameDayForSameGroup || [];

    return {
      calendar_calendarEventsIterator: eventData?.event
        ? {
            ...eventData?.event,
            updatedAt: lastUpdate?.updatedAt,
            updatedBy: lastUpdate?.updatedBy,
            additionalLessons: additionalLessons.sort(
              (eventA, eventB) =>
                dayjs(eventA.startTime).unix() - dayjs(eventB.startTime).unix()
            ),
          }
        : undefined,
    };
  },
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

export type ReturnTypeFromUseSubjectGroupLessonByIterator = UseQueryReturnType<
  typeof useSubjectGroupLessonByIterator
>;
