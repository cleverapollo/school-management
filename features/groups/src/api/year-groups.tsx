import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UpdateYearGroupEnrollmentInput,
  UseQueryReturnType,
  YearGroupEnrollmentFilter,
} from '@tyro/api';
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
        extensions {
          priority
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
  queryFn: async () => {
    const { core_yearGroupEnrollments: yearGroupEnrollments } =
      await gqlClient.request(yearGroupsList, { filter: {} });

    return {
      core_yearGroupEnrollments: yearGroupEnrollments.sort((prev, next) =>
        prev.name.localeCompare(next.name)
      ),
    };
  },
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

const yearGroupByIdQuery = (filter: YearGroupEnrollmentFilter) => ({
  queryKey: groupsKeys.year.details(filter),
  queryFn: async () =>
    gqlClient.request(yearGroupById, {
      filter,
    }),
});

export function getYearGroupById(filter: YearGroupEnrollmentFilter) {
  return queryClient.fetchQuery(yearGroupByIdQuery(filter));
}

export function useYearGroupById(
  filter: YearGroupEnrollmentFilter,
  enabled = true
) {
  return useQuery({
    ...yearGroupByIdQuery(filter),
    enabled,
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

export type ReturnTypeFromUseYearGroupById = UseQueryReturnType<
  typeof useYearGroupById
>;
