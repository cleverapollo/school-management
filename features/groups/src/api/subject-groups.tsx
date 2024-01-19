import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Core_SwitchSubjectGroupType,
  gqlClient,
  graphql,
  queryClient,
  SubjectGroupFilter,
  SubjectGroupType,
  UpdateSubjectGroupInput,
  UseQueryReturnType,
} from '@tyro/api';
import { sortByDisplayName } from '@tyro/core';
import { groupsKeys } from './keys';

const subjectGroupsList = graphql(/* GraphQL */ `
  query subjectGroups($filter: SubjectGroupFilter!) {
    subjectGroups(filter: $filter) {
      partyId
      name
      avatarUrl
      subjects {
        id
        name
        colour
        nationalCode
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
        examinable
      }
      programmeStages {
        programme {
          name
        }
      }
      yearGroups {
        name
      }
      studentMembershipType {
        type
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
      studentMembershipType {
        type
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
          partyId
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

const updateSubjectGroups = graphql(/* GraphQL */ `
  mutation core_updateSubjectGroups($input: [UpdateSubjectGroupInput!]) {
    core_updateSubjectGroups(input: $input) {
      success
    }
  }
`);

const switchSubjectGroupType = graphql(/* GraphQL */ `
  mutation core_switchSubjectGroupType($input: Core_SwitchSubjectGroupType!) {
    core_switchSubjectGroupType(input: $input) {
      success
    }
  }
`);

const subjectGroupsQuery = {
  list: {
    queryKey: groupsKeys.subject.groups(),
    queryFn: async () =>
      gqlClient.request(subjectGroupsList, {
        filter: {
          partyIds: [] as number[],
          type: [SubjectGroupType.SubjectGroup],
        },
      }),
  },
  details: (id?: number) => ({
    queryKey: groupsKeys.subject.details(id),
    queryFn: () =>
      gqlClient.request(subjectGroupById, {
        filter: { partyIds: [id ?? 0] },
      }),
  }),
  detailsByFilter: (filter: SubjectGroupFilter) => ({
    queryKey: groupsKeys.subject.detailsByFilter(filter),
    queryFn: () =>
      gqlClient.request(subjectGroupById, {
        filter,
      }),
  }),
};

export function getSubjectGroups() {
  return queryClient.fetchQuery(subjectGroupsQuery.list);
}

export function getSubjectGroupById(id?: number) {
  return queryClient.fetchQuery(subjectGroupsQuery.details(id));
}

export function getSubjectGroupByFilter(filter: SubjectGroupFilter) {
  return queryClient.fetchQuery(subjectGroupsQuery.detailsByFilter(filter));
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

      return {
        ...group,
        staff: group.staff?.sort(sortByDisplayName),
        students: group.students?.sort((studentA, studentB) =>
          sortByDisplayName(studentA.person, studentB.person)
        ),
      };
    },
  });
}

export function useSubjectGroupByFilter(filter: SubjectGroupFilter) {
  return useQuery({
    ...subjectGroupsQuery.detailsByFilter(filter),
    select: ({ subjectGroups }) => {
      if (!subjectGroups) return null;

      const [group] = subjectGroups || [];

      return {
        ...group,
        staff: group.staff?.sort(sortByDisplayName),
        students: group.students?.sort((studentA, studentB) =>
          sortByDisplayName(studentA.person, studentB.person)
        ),
      };
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

export function useSwitchSubjectGroupType() {
  return useMutation({
    mutationFn: (input: Core_SwitchSubjectGroupType) =>
      gqlClient.request(switchSubjectGroupType, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(groupsKeys.subject.all());
      queryClient.invalidateQueries(groupsKeys.support.all());
    },
  });
}

export type ReturnTypeOfUseSubjectGroupList = UseQueryReturnType<
  typeof useSubjectGroups
>;
