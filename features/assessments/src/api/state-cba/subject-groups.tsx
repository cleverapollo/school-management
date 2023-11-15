import { useQuery } from '@tanstack/react-query';

import {
  SubjectGroupFilter,
  UseQueryReturnType,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { assessmentsKeys } from '../keys';

const subjectsList = graphql(/* GraphQL */ `
  query subjectsList($filter: SubjectGroupFilter!) {
    subjectGroups(filter: $filter) {
      subjects {
        id
        name
        colour
      }
    }
  }
`);

const subjectGroupsList = graphql(/* GraphQL */ `
  query subjectGroupsList($filter: SubjectGroupFilter!) {
    subjectGroups(filter: $filter) {
      partyId
      name
      avatarUrl
      subjects {
        name
        colour
      }
      yearGroups {
        name
      }
    }
  }
`);

type FormattedSubjectsType = {
  name: string;
  id: number;
}[];

const subjectsListQuery = (filter: SubjectGroupFilter) => ({
  queryKey: assessmentsKeys.subjects(filter),
  queryFn: () => gqlClient.request(subjectsList, { filter }),
});

export function getSubjectsListQuery(filter: SubjectGroupFilter) {
  return queryClient.fetchQuery(subjectsListQuery(filter));
}

export function useSubjectsListQuery(filter: SubjectGroupFilter) {
  return useQuery({
    ...subjectsListQuery(filter),
    select: ({ subjectGroups }) => {
      if (!Array.isArray(subjectGroups)) return [];
      const subjects = subjectGroups?.flatMap(
        (subject) => subject?.subjects[0]
      );

      const subjectList = subjects.reduce<FormattedSubjectsType>(
        (accumulator, current) => {
          if (!accumulator.some((item) => item.name === current.name)) {
            accumulator.push(current);
          }
          return accumulator;
        },
        []
      );

      return subjectList;
    },
  });
}

const subjectGroupsQuery = (filter: SubjectGroupFilter) => ({
  queryKey: assessmentsKeys.subjectGroups(filter),
  queryFn: () => gqlClient.request(subjectGroupsList, { filter }),
});

export function getSubjectGroupsQuery(filter: SubjectGroupFilter) {
  return queryClient.fetchQuery(subjectGroupsQuery(filter));
}

export function useSubjectGroupsQuery(filter: SubjectGroupFilter) {
  return useQuery({
    ...subjectGroupsQuery(filter),
    select: ({ subjectGroups }) => {
      if (!Array.isArray(subjectGroups)) return [];

      return subjectGroups;
    },
  });
}

export type ReturnTypeFromUseSubjectGroups = UseQueryReturnType<
  typeof useSubjectGroupsQuery
>[number];
