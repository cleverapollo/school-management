import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, GeneralGroupType, InputMaybe } from '@tyro/api';

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
        firstName
        lastName
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
        firstName
        lastName
      }
      staff {
        partyId
        firstName
        lastName
      }
    }
  }
`);

export function useCustomGroups() {
  return useQuery({
    queryKey: ['groups', 'custom'],
    queryFn: async () =>
      gqlClient.request(generalGroupsList, {
        filter: {
          groupTypes: [
            GeneralGroupType.DynamicGroup,
            GeneralGroupType.StaticGroup,
          ],
        },
      }),
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

export function useCustomGroupById(id: InputMaybe<number>) {
  return useQuery({
    queryKey: ['groups', 'custom', id],
    queryFn: async () =>
      gqlClient.request(customGroupById, {
        filter: {
          partyIds: [id],
        },
      }),
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

export function useEnrolmentGroups() {
  return useQuery({
    queryKey: ['groups', 'enrolment'],
    queryFn: async () =>
      gqlClient.request(generalGroupsList, {
        filter: {
          groupTypes: [GeneralGroupType.ClassGroup],
        },
      }),
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

export function useEnrolmentGroupById(id: InputMaybe<number>) {
  return useQuery({
    queryKey: ['groups', 'enrolment', id],
    queryFn: async () =>
      gqlClient.request(enrolmentGroupById, {
        filter: {
          partyIds: [id],
        },
      }),
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
