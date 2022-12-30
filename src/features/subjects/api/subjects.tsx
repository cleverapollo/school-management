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
      studentCount
        staff{
            partyId
            person {
                firstName
                lastName
                avatarUrl
            }

        }
      irePP{
        level
      }
      programmeStages {
        programmeStage {
          programme {
            name
          }
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

