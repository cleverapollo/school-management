import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, UseQueryReturnType } from '@tyro/api';
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
  return useQuery({
    ...studentsForSiblingSearchQuery(),
    select: ({ core_students }) => core_students,
  });
}

export type ReturnTypeFromUseStudentsForSiblingSearch = UseQueryReturnType<
  typeof useStudentsForSiblingSearch
>[number];
