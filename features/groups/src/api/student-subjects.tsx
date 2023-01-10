import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';

const studentSubjectGroups = graphql(/* GraphQL */ `
  query subjectGroups {
    subjectGroups {
      partyId
      name
      subjects {
        name
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
    }
  }
`);

export function useStudentSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: () => gqlClient.request(studentSubjectGroups),
    select: ({ subjectGroups }) => subjectGroups,
  });
}
