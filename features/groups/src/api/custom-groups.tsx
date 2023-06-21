import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  GeneralGroupType,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { groupsKeys } from './keys';

const customGroupsList = graphql(/* GraphQL */ `
  query customGroupsList($filter: GeneralGroupFilter!) {
    generalGroups(filter: $filter) {
      partyId
      name
      avatarUrl
      studentMembers {
        memberCount
      }
      staffMembers {
        memberCount
      }
      contactMembers {
        memberCount
      }
    }
  }
`);

const customGroupById = graphql(/* GraphQL */ `
  query customGroupById($filter: GeneralGroupFilter!) {
    generalGroups(filter: $filter) {
      partyId
      name
      students {
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
      staff {
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
      contacts {
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
  }
`);

const customGroupsQuery = {
  queryKey: groupsKeys.custom.groups(),
  queryFn: async () =>
    gqlClient.request(customGroupsList, {
      filter: {
        groupTypes: [GeneralGroupType.CustomGroup],
      },
    }),
};

export function getCustomGroups() {
  return queryClient.fetchQuery(customGroupsQuery);
}

export function useCustomGroups() {
  return useQuery({
    ...customGroupsQuery,
    select: ({ generalGroups }) => generalGroups,
  });
}

const customGroupsByIdQuery = (id: number | undefined) => ({
  queryKey: groupsKeys.custom.details(id),
  queryFn: async () =>
    gqlClient.request(customGroupById, {
      filter: {
        partyIds: [id ?? 0],
      },
    }),
});

export function getCustomGroupById(id: number | undefined) {
  return queryClient.fetchQuery(customGroupsByIdQuery(id));
}

export function useCustomGroupById(id: number | undefined) {
  return useQuery({
    ...customGroupsByIdQuery(id),
    select: ({ generalGroups }) => {
      if (!generalGroups) return null;
      const group = generalGroups[0];

      const students = group?.students
        ?.map((student) => student?.person)
        .filter(Boolean);

      return {
        name: group?.name,
        members: [
          ...(students ?? []),
          ...(group?.staff ?? []),
          ...(group?.contacts ?? []),
        ],
      };
    },
  });
}

export type ReturnTypeFromUseCustomGroups = UseQueryReturnType<
  typeof useCustomGroups
>[number];
