import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  Tt_AddLessonFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { timetableKeys } from '../keys';

const addLessonOptions = graphql(/* GraphQL */ `
  query tt_addLessonOptions($filter: Tt_AddLessonFilter) {
    tt_addLessonOptions(filter: $filter) {
      freeStaffIds
      freeStaff {
        partyId
        person {
          partyId
          title {
            id
            nameTextId
            name
          }
          firstName
          lastName
          avatarUrl
          type
        }
      }
      freeTimetableGroupIds
      freeTimetableGroups {
        partyId
        name
        avatarUrl
      }
      freeRoomIds
      freeRooms {
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
  }
`);

const addLessonOptionsQuery = (filter: Tt_AddLessonFilter) => ({
  queryKey: timetableKeys.addLessonsOptions(filter),
  queryFn: async () =>
    gqlClient.request(addLessonOptions, {
      filter,
    }),
});

export function getAddLessonOptionsQuery(filter: Tt_AddLessonFilter) {
  return queryClient.fetchQuery(addLessonOptionsQuery(filter));
}

export function useAddLessonOptionsQuery(filter: Tt_AddLessonFilter) {
  return useQuery({
    ...addLessonOptionsQuery(filter),
    select: ({ tt_addLessonOptions }) => tt_addLessonOptions,
  });
}

export type ReturnTypeFromAddLessonOptionsQuery = UseQueryReturnType<
  typeof addLessonOptionsQuery
>;
