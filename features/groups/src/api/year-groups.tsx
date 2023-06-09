import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UpdateYearGroupEnrollmentInput,
  UseQueryReturnType,
} from '@tyro/api';

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
        title
        titleId
        firstName
        lastName
        avatarUrl
        type
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
          title
          firstName
          lastName
          avatarUrl
          type
        }
        classGroup {
          name
        }
        tutors {
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

const updateYearGroupLeads = graphql(/* GraphQL */ `
  mutation core_updateYearGroupEnrollments(
    $input: [UpdateYearGroupEnrollmentInput!]
  ) {
    core_updateYearGroupEnrollments(input: $input) {
      success
    }
  }
`);

export const yearGroupsKeys = {
  list: ['groups', 'year'] as const,
  details: (id: number | undefined) => [...yearGroupsKeys.list, id] as const,
};

const yearGroupsQuery = {
  queryKey: yearGroupsKeys.list,
  queryFn: async () => gqlClient.request(yearGroupsList, { filter: {} }),
};

export function getYearGroups() {
  return queryClient.fetchQuery(yearGroupsQuery);
}

export function useYearGroups() {
  return useQuery({
    ...yearGroupsQuery,
    select: ({ core_yearGroupEnrollments }) => core_yearGroupEnrollments,
  });
}

const yearGroupByIdQuery = (id: number | undefined) => ({
  queryKey: yearGroupsKeys.details(id),
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
      queryClient.invalidateQueries(yearGroupsKeys.list);
    },
  });
}

export type ReturnTypeFromUseYearGroups = UseQueryReturnType<
  typeof useYearGroups
>[number];
