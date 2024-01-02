import {
  gqlClient,
  graphql,
  Sa_ClassAwayFilter,
  UseQueryReturnType,
  queryClient,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { activitiesKeys } from './keys';

const classAway = graphql(/* GraphQL */ `
  query sa_classAway($filter: Sa_ClassAwayFilter!) {
    sa_classAway(filter: $filter) {
      freeStaffPartyIds
      cancelled
      staffAreFreed
      freeStaff {
        partyId
        title {
          id
          nameTextId
          name
        }
        firstName
        lastName
        avatarUrl
        archived
        type
      }
      studentsAttendingActivityTotal
      studentsInGroupTotal
      event {
        name
        colour
        calendarEventId {
          eventId
          date
        }
        eventId
        calendarIds
        startTime
        endTime
        type
        allDayEvent
        attendees {
          partyId
          type
          partyInfo {
            partyId
          }
        }
        lessonInfo {
          subjectGroupId
          lessonId
        }
        roomIds
        rooms {
          roomId
          name
          capacity
          description
          pools
          includeInTimetable
          externalSystemId
          location
          disabled
        }
      }
      affectedAttendees {
        partyId
      }
    }
  }
`);

const classAwayQuery = (filter: Sa_ClassAwayFilter) => ({
  queryKey: activitiesKeys.classAway(filter),
  queryFn: () =>
    gqlClient.request(classAway, {
      filter,
    }),
});

export function getClassAway(filter: Sa_ClassAwayFilter) {
  return queryClient.fetchQuery(classAwayQuery(filter));
}

export function useClassAway(filter: Sa_ClassAwayFilter) {
  return useQuery({
    ...classAwayQuery(filter),
    select: ({ sa_classAway }) => sa_classAway,
  });
}

export type ReturnTypeFromUseClassAway = UseQueryReturnType<
  typeof useClassAway
>[number];
