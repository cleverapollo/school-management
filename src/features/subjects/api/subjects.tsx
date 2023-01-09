import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';

const subjectGroups = graphql(/* GraphQL */ `
  query studentSubjectGroups{
    subjectGroups{
      partyId
      name
      subjects{
        name
      }
      studentMembers {
            memberCount
        }
        staff{
                firstName
                lastName
                avatarUrl
        }
      irePP{
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

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () =>
      gqlClient.request(subjectGroups),
    select: ({ subjectGroups }) => {
      return subjectGroups
    }
  });
}

