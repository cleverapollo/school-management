import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UpdateYearGroupEnrollmentInput,
  UseQueryReturnType,
  YearGroupsListQuery,
} from '@tyro/api';
import { useCallback } from 'react';
import { groupsKeys } from './keys';

const yearGroupsList = graphql(/* GraphQL */ `
  query yearGroupsList($filter: YearGroupEnrollmentFilter) {
    core_yearGroupEnrollments(filter: $filter) {
      yearGroupEnrollmentPartyId
      name
      nationalCode
      yearGroupId
      shortName
      description
      yearGroupLeads {
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
      studentMembers {
        memberCount
      }
    }
  }
`);

const yearGroupById = graphql(/* GraphQL */ `
  query yearGroupById($filter: YearGroupEnrollmentFilter) {
    core_yearGroupEnrollments(filter: $filter) {
      yearGroupEnrollmentPartyId
      name
      students {
        partyId
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
        classGroup {
          name
        }
        tutors {
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
  }
`);

const updateYearGroupLeads = graphql(/* GraphQL */ `
  mutation core_updateYearGroupEnrollments(
    $input: [UpdateYearGroupEnrollmentInput!]
  ) {
    core_updateYearGroupEnrollments(input: $input) {
      success
    }
  }
`);

const yearGroupsQuery = {
  queryKey: groupsKeys.year.groups(),
  queryFn: async () => gqlClient.request(yearGroupsList, { filter: {} }),
};

export async function getYearGroups() {
  const { core_yearGroupEnrollments: yearGroupEnrollments } =
    await queryClient.fetchQuery(yearGroupsQuery);

  return {
    core_yearGroupEnrollments: yearGroupEnrollments.sort((prev, next) =>
      prev.name.localeCompare(next.name)
    ),
  };
}

export function useYearGroups() {
  return useQuery({
    ...yearGroupsQuery,
    select: ({ core_yearGroupEnrollments }) => core_yearGroupEnrollments,
  });
}

const yearGroupByIdQuery = (id: number | undefined) => ({
  queryKey: groupsKeys.year.details(id),
  queryFn: async () =>
    gqlClient.request(yearGroupById, {
      filter: {
        yearGroupEnrollmentPartyId: [id ?? 0],
      },
    }),
});

export function getYearGroupById(id: number | undefined) {
  return queryClient.fetchQuery(yearGroupByIdQuery(id));
}

export function useYearGroupById(id: number | undefined) {
  return useQuery({
    ...yearGroupByIdQuery(id),
    select: ({ core_yearGroupEnrollments }) => {
      if (!Array.isArray(core_yearGroupEnrollments)) return null;

      const [group] = core_yearGroupEnrollments || [];

      return group;
    },
  });
}

export function useUpdateYearGroupLeads() {
  return useMutation({
    mutationFn: (input: UpdateYearGroupEnrollmentInput[]) =>
      gqlClient.request(updateYearGroupLeads, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(groupsKeys.year.all());
    },
  });
}

export type ReturnTypeFromUseYearGroups = UseQueryReturnType<
  typeof useYearGroups
>[number];
