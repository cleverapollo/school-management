import { useQuery } from '@tanstack/react-query';
import {
  CalendarEventIteratorFilter,
  gqlClient,
  graphql,
  Iterator,
  queryClient,
} from '@tyro/api';
import { useEffect } from 'react';

const subjectGroupsList = graphql(/* GraphQL */ `
  query subjectGroups {
    subjectGroups {
      partyId
      name
      subjects {
        name
      }
      studentMembers {
        memberCount
      }
      staff {
        firstName
        lastName
        avatarUrl
      }
      irePP {
        level
      }
      programmeStages {
        programme {
          name
        }
      }
    }
  }
`);

const subjectGroupById = graphql(/* GraphQL */ `
  query subjectGroupById($filter: SubjectGroupFilter!) {
    subjectGroups(filter: $filter) {
      partyId
      name
      avatarUrl
      yearGroups {
        name
      }
      subjects {
        name
      }
      staff {
        firstName
        lastName
      }
      students {
        partyId
        classGroup {
          name
        }
        person {
          firstName
          lastName
          avatarUrl
        }
      }
    }
  }
`);

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

export const subjectGroupsKeys = {
  list: ['groups', 'subject'] as const,
  lessonList: ['groups', 'subject', 'lesson'] as const,
  lessonDetails: (filter: CalendarEventIteratorFilter) =>
    [...subjectGroupsKeys.lessonList, filter] as const,
  details: (id: number | undefined) => [...subjectGroupsKeys.list, id] as const,
};

const subjectGroupsQuery = {
  queryKey: subjectGroupsKeys.list,
  queryFn: async () => gqlClient.request(subjectGroupsList),
  staleTime: 1000 * 60 * 5,
};

export function getSubjectGroups() {
  return queryClient.fetchQuery(subjectGroupsQuery);
}

export function useSubjectGroups() {
  return useQuery({
    ...subjectGroupsQuery,
    select: ({ subjectGroups }) => subjectGroups,
  });
}

const subjectGroupsByIdQuery = (id: number | undefined) => ({
  queryKey: subjectGroupsKeys.details(id),
  queryFn: async () =>
    gqlClient.request(subjectGroupById, {
      filter: {
        partyIds: [id ?? 0],
      },
    }),
  staleTime: 1000 * 60 * 5,
});

export function getSubjectGroupsById(id: number | undefined) {
  return queryClient.fetchQuery(subjectGroupsByIdQuery(id));
}

export function useSubjectGroupById(id: number | undefined) {
  return useQuery({
    ...subjectGroupsByIdQuery(id),
    select: ({ subjectGroups }) => {
      if (!subjectGroups) return null;

      const [group] = subjectGroups;
      const [firstSubject] = group?.subjects || [];

      return {
        id: (group?.partyId as number).toString(),
        name: group?.name,
        students: group?.students,
        avatarUrl: group?.avatarUrl,
        subject: firstSubject,
        yearGroups: group?.yearGroups,
        teachers: group?.staff,
      };
    },
  });
}

const subjectGroupLessonByIteratorQuery = (
  filter: CalendarEventIteratorFilter
) => ({
  queryKey: subjectGroupsKeys.lessonDetails(filter),
  queryFn: () => gqlClient.request(subjectGroupLessonByIterator, { filter }),
  staleTime: 1000 * 60 * 5,
});

export function getSubjectGroupLessonByIteratorInfo(
  filter: CalendarEventIteratorFilter
) {
  return queryClient.fetchQuery(subjectGroupLessonByIteratorQuery(filter));
}

export function useSubjectGroupLessonByIterator(
  filter: CalendarEventIteratorFilter
) {
  const queryData = useQuery({
    ...subjectGroupLessonByIteratorQuery(filter),
    select: ({ calendar_calendarEventsIterator }) =>
      calendar_calendarEventsIterator,
  });

  useEffect(() => {
    if (queryData.data?.startTime) {
      getSubjectGroupLessonByIteratorInfo({
        partyId: filter.partyId,
        iterator: Iterator.Next,
        eventStartTime: queryData.data.startTime,
      });
      getSubjectGroupLessonByIteratorInfo({
        partyId: filter.partyId,
        iterator: Iterator.Previous,
        eventStartTime: queryData.data.startTime,
      });
    }
  }, [queryData.data?.startTime]);

  return queryData;
}
