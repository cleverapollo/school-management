import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  UseQueryReturnType,
  StudentsForSiblingSearchQuery,
} from '@tyro/api';
import { usePreferredNameLayout } from '@tyro/core';
import { useCallback } from 'react';
import { peopleKeys } from '../keys';

const studentsForSiblingSearch = graphql(/* GraphQL */ `
  query studentsForSiblingSearch {
    core_students {
      partyId
      person {
        partyId
        title {
          id
          nameTextId
          name
        }
        firstName
        lastName
        avatarUrl
        type
      }
      classGroup {
        name
      }
      contacts {
        partyId
        person {
          firstName
          lastName
          avatarUrl
          type
        }
      }
    }
  }
`);

const studentsForSiblingSearchQuery = () => ({
  queryKey: peopleKeys.students.studentsForSiblingSearch(),
  queryFn: async () => gqlClient.request(studentsForSiblingSearch),
});

export function useStudentsForSiblingSearch() {
  const { sortByDisplayName } = usePreferredNameLayout();

  return useQuery({
    ...studentsForSiblingSearchQuery(),
    select: useCallback(
      ({ core_students }: StudentsForSiblingSearchQuery) =>
        core_students.sort((studentA, studentB) =>
          sortByDisplayName(studentA.person, studentB.person)
        ),
      [sortByDisplayName]
    ),
  });
}

export type ReturnTypeFromUseStudentsForSiblingSearch = UseQueryReturnType<
  typeof useStudentsForSiblingSearch
>[number];
