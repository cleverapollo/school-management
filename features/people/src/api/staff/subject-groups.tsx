import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  StaffFilter,
  SubjectGroupRelationshipFilter,
} from '@tyro/api';
import { peopleKeys } from '../keys';

const staffSubjectGroups = graphql(/* GraphQL */ `
  query core_staff_subjectGroups(
    $filter: StaffFilter
    $filter2: SubjectGroupRelationshipFilter
  ) {
    core_staff(filter: $filter) {
      subjectGroups(filter: $filter2) {
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

const staffSubjectGroupsQuery = (
  filter: StaffFilter,
  subjectGroupMembershipFilter: SubjectGroupRelationshipFilter | undefined
) => ({
  queryKey: peopleKeys.staff.subjectGroups(
    filter,
    subjectGroupMembershipFilter
  ),
  queryFn: async () =>
    gqlClient.request(staffSubjectGroups, {
      filter,
      filter2:
        subjectGroupMembershipFilter == null
          ? null
          : {
              ...subjectGroupMembershipFilter,
              __typename: 'SubjectGroupRelationshipFilter',
            },
    }),
});

export function getStaffSubjectGroups(
  filter: StaffFilter,
  subjectGroupMembershipFilter: SubjectGroupRelationshipFilter | undefined
) {
  return queryClient.fetchQuery(
    staffSubjectGroupsQuery(filter, subjectGroupMembershipFilter)
  );
}

export function useStaffSubjectGroups(
  filter: StaffFilter,
  subjectGroupMembershipFilter: SubjectGroupRelationshipFilter | undefined,
  enabled = true
) {
  return useQuery({
    ...staffSubjectGroupsQuery(filter, subjectGroupMembershipFilter),
    select: ({ core_staff }) => {
      const [{ subjectGroups }] = core_staff;

      return subjectGroups;
    },
    enabled,
  });
}
