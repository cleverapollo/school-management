import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  Tt_GroupsFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { timetableKeys } from '../keys';

const ttSubjectGroups = graphql(/* GraphQL */ `
  query tt_groups($filter: TT_GroupsFilter!) {
    tt_groups(filter: $filter) {
      partyGroup {
        __typename
        name
        partyId
        avatarUrl
        ... on SubjectGroup {
          yearGroups {
            name
          }
          subjects {
            colour
          }
          studentMembershipType {
            type
            classGroupId
            blockId
            classGroupName
          }
        }
      }
      teachers {
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
      lessons {
        id {
          lessonIdx
          lessonInstanceIdx
          timetableGroupId
        }
        timeslotId {
          gridIdx
          dayIdx
          periodIdx
        }
        timeslotInfo {
          startTime
          endTime
        }
        partyGroup {
          __typename
          partyId
          name
          avatarUrl
          ... on SubjectGroup {
            subjects {
              name
              colour
            }
          }
        }
        room {
          roomId
          name
        }
        teachers {
          person {
            partyId
            title {
              id
              name
              nameTextId
            }
            firstName
            lastName
            avatarUrl
            type
          }
        }
        spread
      }
    }
  }
`);

const ttSubjectGroupQuery = (filter: Tt_GroupsFilter) => ({
  queryKey: timetableKeys.subjectGroups(filter),
  queryFn: () => gqlClient.request(ttSubjectGroups, { filter }),
});

export function getTimetableSubjectGroups(filter: Tt_GroupsFilter) {
  return queryClient.fetchQuery(ttSubjectGroupQuery(filter));
}

export function useTimetableSubjectGroups(filter: Tt_GroupsFilter) {
  return useQuery({
    ...ttSubjectGroupQuery(filter),
    enabled: filter.timetableId !== 0,
    select: ({ tt_groups }) => tt_groups,
  });
}

export type ReturnTypeFromUseTimetableSubjectGroups = UseQueryReturnType<
  typeof useTimetableSubjectGroups
>[number];
