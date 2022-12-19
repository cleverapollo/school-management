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
        person {
            firstName
            lastName    
            pictureUrl
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

const subjectGroupById = graphql(/* GraphQL */ `
  query subjectGroupById($filter: SubjectGroupFilter!){
    subjectGroups(filter: $filter) {
      partyId
      name
      students {
        partyId
          person {
              firstName
              lastName
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
      return subjectGroups
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
