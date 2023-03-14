import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';

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
      students {
        person {
          firstName
          lastName
          avatarUrl
        }
      }
    }
  }
`);

export const subjectGroupsKeys = {
  list: ['groups', 'subject'] as const,
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
      const group = subjectGroups[0];

      return {
        id: (group?.partyId as number).toString(),
        name: group?.name,
        members: group?.students,
      };
    },
  });
}
