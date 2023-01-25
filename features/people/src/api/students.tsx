import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';

const students = graphql(/* GraphQL */ `
  query core_students {
    core_students {
      partyId
      person {
        avatarUrl
        firstName
        lastName
      }
      classGroup {
        name
      }
    }
  }
`);

export function useStudents() {
  return useQuery({
    queryKey: ['people', 'students'],
    queryFn: async () => gqlClient.request(students),
    select: ({ core_students }) => core_students,
  });
}
