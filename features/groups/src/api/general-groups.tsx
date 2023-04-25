import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, GeneralGroupType, queryClient } from '@tyro/api';

const enrolmentGroupsList = graphql(/* GraphQL */ `
  query enrolmentGroupsList($filter: GeneralGroupFilter!) {
    generalGroups(filter: $filter) {
      partyId
      name
      studentMembers {
        memberCount
      }
      staffMembers {
        memberCount
      }
      contactMembers {
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

const enrolmentGroupById = graphql(/* GraphQL */ `
  query enrolmentGroupsById($filter: GeneralGroupFilter!) {
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

export const enrolmentGroupsKeys = {
  list: ['groups', 'enrolment'] as const,
  details: (id: number | undefined) =>
    [...enrolmentGroupsKeys.list, id] as const,
};

const enrolmentGroupsQuery = {
  queryKey: enrolmentGroupsKeys.list,
  queryFn: async () =>
    gqlClient.request(enrolmentGroupsList, {
      filter: {
        groupTypes: [GeneralGroupType.ClassGroup],
      },
    }),
};

export function getEnrolmentGroups() {
  return queryClient.fetchQuery(enrolmentGroupsQuery);
}

export function useEnrolmentGroups() {
  return useQuery({
    ...enrolmentGroupsQuery,
    select: ({ generalGroups }) => generalGroups,
  });
}

const enrolmentGroupsByIdQuery = (id: number | undefined) => ({
  queryKey: enrolmentGroupsKeys.details(id),
  queryFn: async () =>
    gqlClient.request(enrolmentGroupById, {
      filter: {
        partyIds: [id ?? 0],
      },
    }),
});

export function getEnrolmentGroupsById(id: number | undefined) {
  return queryClient.fetchQuery(enrolmentGroupsByIdQuery(id));
}

export function useEnrolmentGroupById(id: number | undefined) {
  return useQuery({
    ...enrolmentGroupsByIdQuery(id),
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
