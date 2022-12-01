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
      staff{
        partyId
        firstName
        lastName
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

const subjectGroupById = graphql(/* GraphQL */ `
  query subjectGroupById($filter: SubjectGroupFilter!){
    subjectGroups(filter: $filter) {
      partyId
      name
      students {
        partyId
        firstName
        lastName
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

export function useSubjectGroupById(id: string | undefined) {
  return useQuery({
    queryKey: ['groups', 'subject', id],
    queryFn: async () =>
      gqlClient.request(subjectGroupById, {
        filter: {
          partyIds: [id]
        }
      }),
    select: ({ subjectGroups }) => {
      if (!subjectGroups) return null;
      const group = subjectGroups[0];

      return {
        id: group?.partyId?.toString(),
        name: group?.name,
        members: group?.students
      }
    }
  });
}
