import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UpdateSubjectGroupInput,
  UseQueryReturnType,
} from '@tyro/api';
import { groupsKeys } from './keys';
import { useClassGroups } from './class-groups';

const subjectGroupsList = graphql(/* GraphQL */ `
  query subjectGroups($filter: SubjectGroupFilter!) {
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
  query subjectGroupById($filter: SubjectGroupFilter!) {
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
    queryKey: groupsKeys.subject.groups(),
    queryFn: async () =>
      gqlClient.request(subjectGroupsList, {
        filter: {},
      }),
  },
  details: (id?: number) => ({
    queryKey: groupsKeys.subject.details(id),
    queryFn: () =>
      gqlClient.request(subjectGroupById, {
        filter: { partyIds: [id ?? 0] },
      }),
  }),
};

export function getSubjectGroups() {
  return queryClient.fetchQuery(subjectGroupsQuery.list);
}

export function getSubjectGroupById(id?: number) {
  return queryClient.fetchQuery(subjectGroupsQuery.details(id));
}

export function useSubjectGroups() {
  return useQuery({
    ...subjectGroupsQuery.list,
    select: ({ subjectGroups }) => subjectGroups,
  });
}

export function useSubjectGroupById(id?: number) {
  return useQuery({
    ...subjectGroupsQuery.details(id),
    select: ({ subjectGroups }) => {
      if (!subjectGroups) return null;

      const [group] = subjectGroups || [];

      return group;
    },
  });
}

export function useSaveSubjectGroupEdits() {
  return useMutation({
    mutationFn: (input: UpdateSubjectGroupInput[]) =>
      gqlClient.request(updateSubjectGroups, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(groupsKeys.subject.all());
    },
  });
}
