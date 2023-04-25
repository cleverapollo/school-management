import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  GeneralGroupType,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';

const classGroupsList = graphql(/* GraphQL */ `
  query classGroupsList($filter: GeneralGroupFilter!) {
    generalGroups(filter: $filter) {
      partyId
      name
      studentMembers {
        memberCount
      }
      generalGroupType
      programmeStages {
        programme {
          name
        }
      }
      tutors {
        partyId
        title
        firstName
        lastName
        type
      }
      yearGroupLeads {
        partyId
        title
        firstName
        lastName
        type
      }
      yearGroups {
        name
      }
    }
  }
`);

const classGroupById = graphql(/* GraphQL */ `
  query classGroupsById($filter: GeneralGroupFilter!) {
    generalGroups(filter: $filter) {
      partyId
      name
      students {
        person {
          partyId
          title
          firstName
          lastName
          avatarUrl
          type
        }
      }
    }
  }
`);

export const classGroupsKeys = {
  list: ['groups', 'class'] as const,
  details: (id: number | undefined) => [...classGroupsKeys.list, id] as const,
};

const classGroupsQuery = {
  queryKey: classGroupsKeys.list,
  queryFn: async () =>
    gqlClient.request(classGroupsList, {
      filter: {
        groupTypes: [GeneralGroupType.ClassGroup],
      },
    }),
};

export function getClassGroups() {
  return queryClient.fetchQuery(classGroupsQuery);
}

export function useClassGroups() {
  return useQuery({
    ...classGroupsQuery,
    select: ({ generalGroups }) => generalGroups,
  });
}

const classGroupsByIdQuery = (id: number | undefined) => ({
  queryKey: classGroupsKeys.details(id),
  queryFn: async () =>
    gqlClient.request(classGroupById, {
      filter: {
        partyIds: [id ?? 0],
      },
    }),
});

export function getClassGroupsById(id: number | undefined) {
  return queryClient.fetchQuery(classGroupsByIdQuery(id));
}

export function useClassGroupById(id: number | undefined) {
  return useQuery({
    ...classGroupsByIdQuery(id),
    select: ({ generalGroups }) => {
      if (!generalGroups) return null;
      const group = generalGroups[0];

      return {
        name: group?.name,
        members: group?.students ?? [],
      };
    },
  });
}

export type ReturnTypeFromUseClassGroups = UseQueryReturnType<
  typeof useClassGroups
>[number];
