import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, GeneralGroupType, queryClient } from '@tyro/api';

const generalGroupsList = graphql(/* GraphQL */ `
  query generalGroupsList($filter: GeneralGroupFilter!) {
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

const customGroupById = graphql(/* GraphQL */ `
  query customGroupById($filter: GeneralGroupFilter!) {
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
      staff {
        partyId
        title
        firstName
        lastName
        avatarUrl
        type
      }
      contacts {
        partyId
        title
        firstName
        lastName
        avatarUrl
        type
      }
    }
  }
`);

export const customGroupsKeys = {
  list: ['groups', 'custom'] as const,
  details: (id: number | undefined) => [...customGroupsKeys.list, id] as const,
};

const customGroupsQuery = {
  queryKey: customGroupsKeys.list,
  queryFn: async () =>
    gqlClient.request(generalGroupsList, {
      filter: {
        groupTypes: [
          GeneralGroupType.DynamicGroup,
          GeneralGroupType.StaticGroup,
        ],
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
  queryKey: customGroupsKeys.details(id),
  queryFn: async () =>
    gqlClient.request(customGroupById, {
      filter: {
        partyIds: [id ?? 0],
      },
    }),
});

export function getCustomGroupsById(id: number | undefined) {
  return queryClient.fetchQuery(customGroupsByIdQuery(id));
}

export function useCustomGroupById(id: number | undefined) {
  return useQuery({
    ...customGroupsByIdQuery(id),
    select: ({ generalGroups }) => {
      if (!generalGroups) return null;
      const group = generalGroups[0];

      const students =
        group?.students?.reduce<
          NonNullable<
            NonNullable<(typeof group)['students']>[number]
          >['person'][]
        >((acc, student) => {
          if (student?.person) {
            acc.push(student.person);
          }
          return acc;
        }, []) ?? [];

      return {
        name: group?.name,
        members: [
          ...students,
          ...(group?.staff ?? []),
          ...(group?.contacts ?? []),
        ],
      };
    },
  });
}

export const enrolmentGroupsKeys = {
  list: ['groups', 'enrolment'] as const,
  details: (id: number | undefined) =>
    [...enrolmentGroupsKeys.list, id] as const,
};

const enrolmentGroupsQuery = {
  queryKey: enrolmentGroupsKeys.list,
  queryFn: async () =>
    gqlClient.request(generalGroupsList, {
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
  staleTime: 1000 * 60 * 5,
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
