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
        partyId
        person {
          firstName
          lastName
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
        partyId
        person {
          firstName
          lastName
        }
      }
      staff {
        partyId
        firstName
        lastName
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
  staleTime: 1000 * 60 * 5,
};

export function getCustomGroups() {
  return queryClient.fetchQuery(customGroupsQuery);
}

export function useCustomGroups() {
  return useQuery({
    ...customGroupsQuery,
    select: ({ generalGroups }) =>
      generalGroups?.map((group) => ({
        name: group?.name,
        members: group?.studentMembers?.memberCount,
        type: group?.generalGroupType,
        created: 'Rachel',
        id: (group?.partyId as number).toString(),
      })),
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
  staleTime: 1000 * 60 * 5,
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

      return {
        id: (group?.partyId as number).toString(),
        name: group?.name,
        members: [...(group?.students ?? []), ...(group?.staff ?? [])],
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
  staleTime: 1000 * 60 * 5,
};

export function getEnrolmentGroups() {
  return queryClient.fetchQuery(enrolmentGroupsQuery);
}

export function useEnrolmentGroups() {
  return useQuery({
    ...enrolmentGroupsQuery,
    select: ({ generalGroups }) =>
      generalGroups?.map((group) => ({
        name: group?.name,
        members: group?.studentMembers?.memberCount,
        programme: Array.isArray(group?.programmeStages)
          ? group?.programmeStages[0]?.programme?.name
          : null,
        // ToDo: change this mocks to data from backend when it will be implemented
        year: '1',
        tutor: 'Rachel',
        yearhead: 'Rachel',
        id: (group?.partyId as number).toString(),
      })),
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
        id: (group?.partyId as number).toString(),
        name: group?.name,
        members: group?.students ?? [],
      };
    },
  });
}
