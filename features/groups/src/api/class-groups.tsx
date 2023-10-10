import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  GeneralGroupType,
  queryClient,
  UseQueryReturnType,
  UpdateClassGroupGroupInput,
  ClassGroupsListQuery,
} from '@tyro/api';
import { groupsKeys } from './keys';

const classGroupsList = graphql(/* GraphQL */ `
  query classGroupsList($filter: GeneralGroupFilter!) {
    generalGroups(filter: $filter) {
      partyId
      name
      avatarUrl
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
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        type
      }
      yearGroupLeads {
        partyId
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        type
      }
      yearGroups {
        yearGroupId
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
          title {
            nameTextId
            id
            name
          }
          firstName
          lastName
          avatarUrl
          type
        }
        extensions {
          priority
        }
      }
      relatedSubjectGroups {
        name
        partyId
        avatarUrl
        studentMembershipType {
          type
        }
        subjects {
          name
          colour
        }
        programmeStages {
          name
        }
        staff {
          title {
            id
            nameTextId
            name
          }
          type
          firstName
          lastName
        }
        irePP {
          level
        }
        studentMembers {
          memberCount
        }
      }
      blocks {
        blockId
      }
    }
  }
`);

const updateClassGroups = graphql(/* GraphQL */ `
  mutation core_updateClassGroups($input: [UpdateClassGroupGroupInput!]) {
    core_updateClassGroups(input: $input) {
      success
    }
  }
`);

const classGroupsQuery = {
  queryKey: groupsKeys.class.groups(),
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
    select: useCallback(
      ({ generalGroups }: ClassGroupsListQuery) => generalGroups,
      []
    ),
  });
}

const classGroupsByIdQuery = (id: number | undefined) => ({
  queryKey: groupsKeys.class.details(id),
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
      return group;
    },
  });
}

export function useSaveClassGroupEdits() {
  return useMutation({
    mutationFn: (input: UpdateClassGroupGroupInput[]) =>
      gqlClient.request(updateClassGroups, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(groupsKeys.class.all());
    },
  });
}

export type ReturnTypeFromUseClassGroups = UseQueryReturnType<
  typeof useClassGroups
>[number];

export type ReturnTypeFromUseClassGroupById = UseQueryReturnType<
  typeof useClassGroupById
>;
