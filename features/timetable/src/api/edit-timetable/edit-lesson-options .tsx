import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  Tt_EditLessonFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { timetableKeys } from '../keys';

const editLessonOptions = graphql(/* GraphQL */ `
  query tt_editLessonOptions($filter: Tt_EditLessonFilter) {
    tt_editLessonOptions(filter: $filter) {
      freeStaffIds
      freeStaff {
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

const editLessonOptionsQuery = (filter: Tt_EditLessonFilter) => ({
  queryKey: timetableKeys.editLessonsOptions(filter),
  queryFn: async () =>
    gqlClient.request(editLessonOptions, {
      filter,
    }),
});

export function getEditLessonOptionsQuery(filter: Tt_EditLessonFilter) {
  return queryClient.fetchQuery(editLessonOptionsQuery(filter));
}

export function useEditLessonOptionsQuery(
  filter: Tt_EditLessonFilter,
  enabled = true
) {
  return useQuery({
    ...editLessonOptionsQuery(filter),
    enabled,
    select: ({ tt_editLessonOptions }) => ({
      ...tt_editLessonOptions,
      freeStaff: tt_editLessonOptions.freeStaff.map(({ person }) => person),
    }),
  });
}

export type ReturnTypeFromEditLessonOptionsQuery = UseQueryReturnType<
  typeof useEditLessonOptionsQuery
>;
