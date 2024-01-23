import {
  gqlClient,
  graphql,
  Sa_LessonsNeedingCoverFilter,
  UseQueryReturnType,
  queryClient,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { activitiesKeys } from './keys';

const lessonsNeedingCover = graphql(/* GraphQL */ `
  query sa_lessonsNeedingCover($filter: Sa_LessonsNeedingCoverFilter!) {
    sa_lessonsNeedingCover(filter: $filter) {
      awayStaffPartyIds
      awayStaff {
        partyId
        firstName
        lastName
        avatarUrl
        type
        archived
      }
      studentsAttendingActivityTotal
      studentsInGroupTotal
      event {
        colour
        calendarEventId {
          eventId
        }
        name
        eventId
        startTime
        endTime
        rooms {
          name
        }
      }
      affectedAttendees {
        partyId
      }
    }
  }
`);

const lessonsNeedingCoverQuery = (filter: Sa_LessonsNeedingCoverFilter) => ({
  queryKey: activitiesKeys.lessonsNeedingCover(filter),
  queryFn: () =>
    gqlClient.request(lessonsNeedingCover, {
      filter,
    }),
});

export function getLessonsNeedingCover(filter: Sa_LessonsNeedingCoverFilter) {
  return queryClient.fetchQuery(lessonsNeedingCoverQuery(filter));
}

export function useLessonsNeedingCover(filter: Sa_LessonsNeedingCoverFilter) {
  return useQuery({
    ...lessonsNeedingCoverQuery(filter),
    select: ({ sa_lessonsNeedingCover }) => sa_lessonsNeedingCover,
  });
}

export type ReturnTypeFromUseLessonsNeedingCover = UseQueryReturnType<
  typeof useLessonsNeedingCover
>[number];
