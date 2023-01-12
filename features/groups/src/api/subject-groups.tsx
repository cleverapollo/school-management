import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, InputMaybe } from '@tyro/api';

const subjectGroupsList = graphql(/* GraphQL */ `
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

const subjectGroupById = graphql(/* GraphQL */ `
  query subjectGroupById($filter: SubjectGroupFilter!) {
    subjectGroups(filter: $filter) {
      partyId
      name
      students {
        firstName
        lastName
        avatarUrl
      }
    }
  }
`);

export function useSubjectGroups() {
  return useQuery({
    queryKey: ['groups', 'subject'],
    queryFn: async () => gqlClient.request(subjectGroupsList),
    select: ({ subjectGroups }) => subjectGroups,
  });
}

export function useSubjectGroupById(id: InputMaybe<number>) {
  return useQuery({
    queryKey: ['groups', 'subject', id],
    queryFn: async () =>
      gqlClient.request(subjectGroupById, {
        filter: {
          partyIds: [id],
        },
      }),
    select: ({ subjectGroups }) => {
      if (!subjectGroups) return null;
      const group = subjectGroups[0];

      return {
        id: (group?.partyId as number).toString(),
        name: group?.name,
        members: group?.students,
      };
    },
  });
}
