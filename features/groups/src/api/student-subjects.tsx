import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';

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

export const studentSubjectsKeys = {
  all: ['groups', 'subject'] as const,
};

const studentSubjectsQuery = {
  queryKey: studentSubjectsKeys.all,
  queryFn: async () => gqlClient.request(studentSubjectGroups),
  staleTime: 1000 * 60 * 5,
};

export function getStudentSubjects() {
  return queryClient.fetchQuery(studentSubjectsQuery);
}

export function useStudentSubjects() {
  return useQuery({
    ...studentSubjectsQuery,
    select: ({ subjectGroups }) => subjectGroups,
  });
}
