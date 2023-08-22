import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  SubjectGroupType,
  UpdateSubjectGroupInput,
  UseQueryReturnType,
} from '@tyro/api';
import { groupsKeys } from './keys';
import { useClassGroups } from './class-groups';

const subjectGroupsList = graphql(/* GraphQL */ `
  query supportGroups($filter: SubjectGroupFilter!) {
    subjectGroups(filter: $filter) {
      partyId
      name
      avatarUrl
      subjects {
        name
        colour
      }
      studentMembers {
        memberCount
      }
      staff {
        firstName
        lastName
        avatarUrl
      }
      irePP {
        level
      }
      programmeStages {
        programme {
          name
        }
      }
      yearGroups {
        name
      }
    }
  }
`);

const subjectGroupById = graphql(/* GraphQL */ `
  query supportGroupById($filter: SubjectGroupFilter!) {
    subjectGroups(filter: $filter) {
      partyId
      name
      avatarUrl
      yearGroups {
        name
      }
      subjects {
        name
        colour
      }
      staff {
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        type
      }
      students {
        partyId
        classGroup {
          name
        }
        person {
          firstName
          lastName
          avatarUrl
        }
      }
    }
  }
`);

const updateSubjectGroups = graphql(/* GraphQL */ `
  mutation core_updateSubjectGroups($input: [UpdateSubjectGroupInput!]) {
    core_updateSubjectGroups(input: $input) {
      success
    }
  }
`);

const subjectGroupsQuery = {
  list: {
    queryKey: groupsKeys.support.groups(),
    queryFn: async () =>
      gqlClient.request(subjectGroupsList, {
        filter: {
          partyIds: [] as number[],
          type: [SubjectGroupType.SupportGroup],
        },
      }),
  },
  details: (id?: number) => ({
    queryKey: groupsKeys.support.details(id),
    queryFn: () =>
      gqlClient.request(subjectGroupById, {
        filter: { partyIds: [id ?? 0] },
      }),
  }),
};

export function getSupportGroups() {
  return queryClient.fetchQuery(subjectGroupsQuery.list);
}

export function getSupportGroupById(id?: number) {
  return queryClient.fetchQuery(subjectGroupsQuery.details(id));
}

export function useSupportGroups() {
  return useQuery({
    ...subjectGroupsQuery.list,
    select: ({ subjectGroups }) => subjectGroups,
  });
}

export function useSupportGroupById(id?: number) {
  return useQuery({
    ...subjectGroupsQuery.details(id),
    select: ({ subjectGroups }) => {
      if (!subjectGroups) return null;

      const [group] = subjectGroups || [];

      return group;
    },
  });
}

export function useSaveSupportGroupEdits() {
  return useMutation({
    mutationFn: (input: UpdateSubjectGroupInput[]) =>
      gqlClient.request(updateSubjectGroups, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(groupsKeys.support.all());
    },
  });
}
