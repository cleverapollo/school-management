import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, StaffFilter } from '@tyro/api';
import { peopleKeys } from '../keys';

const staffSubjectGroups = graphql(/* GraphQL */ `
  query core_staff_subjectGroups($filter: StaffFilter) {
    core_staff(filter: $filter) {
      subjectGroups {
        partyId
        name
        avatarUrl
        subjects {
          name
          colour
        }
        irePP {
          level
        }
        studentMembers {
          memberCount
        }
      }
    }
  }
`);

const staffSubjectGroupsQuery = (filter: StaffFilter) => ({
  queryKey: peopleKeys.staff.subjectGroups(filter),
  queryFn: async () => gqlClient.request(staffSubjectGroups, { filter }),
});

export function getStaffSubjectGroups(filter: StaffFilter) {
  return queryClient.fetchQuery(staffSubjectGroupsQuery(filter));
}

export function useStaffSubjectGroups(filter: StaffFilter) {
  return useQuery({
    ...staffSubjectGroupsQuery(filter),
    select: ({ core_staff }) => {
      const [{ subjectGroups }] = core_staff;

      return subjectGroups;
    },
  });
}
