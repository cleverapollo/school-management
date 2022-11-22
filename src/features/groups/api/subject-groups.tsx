import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';

const subjectGroups = graphql(/* GraphQL */ `
  query subjectGroups{
    subjectGroups{
      partyId
      name
      subjects{
        name
      }
      studentCount
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

export function useSubjectGroups() {
  return useQuery({
    queryKey: ['groups', 'subject'],
    queryFn: async () =>
      gqlClient.request(subjectGroups),
    select: ({ subjectGroups }) => {
      return subjectGroups?.map(group => ({
        name: group?.name,
        subject: Array.isArray(group?.subjects) ? group?.subjects[0]?.name : null,
        members: group?.studentCount?.toString(),
        level: group?.irePP?.level,
        programme: Array.isArray(group?.programmeStages) ? group?.programmeStages[0]?.programmeStage?.programme?.name : null,
        //ToDo: change this mocks to data from backend when it will be implemented
        teacher: 'Rachel',
        id: group?.partyId?.toString(),
      }))
    }
  });
}
