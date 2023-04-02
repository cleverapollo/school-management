import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, StaffFilter } from '@tyro/api';

const staff = graphql(/* GraphQL */ `
  query core_staff($filter: StaffFilter) {
    core_staff(filter: $filter) {
      partyId
      person {
        firstName
        title
        firstName
        lastName
        avatarUrl
      }
      startDate
      endDate
      personalInformation {
        preferredFirstName
        gender
        primaryPhoneNumber {
          number
        }
        primaryEmail {
          email
        }
      }
      staffIre {
        pps
        religion
        countryOfBirth
      }
      staffIreTeacher {
        teachingPost
        teacherCouncilNumber
      }
      payrollNumber
      noLongerStaffMember
      employmentCapacity
      displayCode
      carRegistrationNumber
    }
  }
`);

export const staffKey = {
  all: ['people', 'staff'] as const,
  details: (filter: StaffFilter) => [...staffKey.all, filter] as const,
};

const staffQuery = (filter: StaffFilter) => ({
  queryKey: staffKey.details(filter),
  queryFn: async () => gqlClient.request(staff, { filter }),
});

export function getStaff(filter: StaffFilter) {
  return queryClient.fetchQuery(staffQuery(filter));
}

export function useStaff(filter: StaffFilter) {
  return useQuery({
    ...staffQuery(filter),
    select: ({ core_staff }) => core_staff,
  });
}
