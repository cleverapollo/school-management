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

const subjectGroupsKeys = {
  list: ['groups', 'subject'] as const,
  details: (id?: number) => [...subjectGroupsKeys.list, id] as const,
};

const subjectGroupsQuery = {
  list: {
    queryKey: subjectGroupsKeys.list,
    queryFn: async () => gqlClient.request(subjectGroupsList),
  },
  details: (id?: number) => ({
    queryKey: subjectGroupsKeys.details(id),
    queryFn: () =>
      gqlClient.request(subjectGroupById, {
        filter: { partyIds: [id ?? 0] },
      }),
  }),
};

export function getSubjectGroups() {
  return queryClient.fetchQuery(subjectGroupsQuery.list);
}

export function getSubjectGroupsById(id?: number) {
  return queryClient.fetchQuery(subjectGroupsQuery.details(id));
}

export function useSubjectGroups() {
  return useQuery({
    ...subjectGroupsQuery.list,
    select: ({ subjectGroups }) => subjectGroups,
  });
}

export function useSubjectGroupById(id?: number) {
  return useQuery({
    ...subjectGroupsQuery.details(id),
    select: ({ subjectGroups }) => {
      if (!subjectGroups) return null;

      const [group] = subjectGroups || [];

      return group;
    },
  });
}
