import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, GeneralGroupType } from '@tyro/api';

const filteredGeneralGroups = graphql(/* GraphQL */ `
  query generalGroups($groupTypes: Array<GeneralGroupType>) {
    generalGroups(groupTypes: $groupTypes){
      partyId
      name
      studentCount
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

const generalGroups = graphql(/* GraphQL */ `
  query generalGroups {
    generalGroups{
      partyId
      name
      studentCount
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
    queryKey: ['groups', 'custom'],
    queryFn: async () =>
      gqlClient.request(generalGroups, { groupTypes: [GeneralGroupType.DynamicGroup, GeneralGroupType.StaticGroup] }),
  });
}

export function useEnrolmentGroups() {
  return useQuery({
    queryKey: ['groups', 'enrolment'],
    queryFn: async () =>
      gqlClient.request(generalGroups, { groupTypes: [GeneralGroupType.ClassGroup] }),
    select: ({ generalGroups }) => {
      return generalGroups.map(group => ({
        name: group.name,
        members: group.studentCount.toString(),
        programme: group.programmeStages[0].programmeStage.programme.name,
        //ToDo: change this mocks to data from backend when it will be implemented
        year: '1',
        tutor: 'Rachel',
        yearhead: 'Rachel',
        id: group.partyId.toString(),
      }))
    }
  });
}
