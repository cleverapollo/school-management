export * from './status';
import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, StaffFilter } from '@tyro/api';

const staff = graphql(/* GraphQL */ `
  query core_staff($filter: StaffFilter) {
    core_staff(filter: $filter) {
      partyId
      person {
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

const staffInfoForSelect = graphql(/* GraphQL */ `
  query core_staffInfoForSelect($filter: StaffFilter) {
    core_staff(filter: $filter) {
      person {
        partyId
        title
        firstName
        lastName
        avatarUrl
        type
      }
    }
  }
`);

export const staffKey = {
  all: ['people', 'staff'] as const,
  details: (filter: StaffFilter) => [...staffKey.all, filter] as const,
  forSelect: () => [...staffKey.all, 'select'] as const,
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


const staffForSelectQuery = (filter: StaffFilter) => ({
  queryKey: staffKey.details(filter),
  queryFn: async () => gqlClient.request(staffInfoForSelect, { filter }),
});

export function useStaffForSelect(filter: StaffFilter) {
  return useQuery({
    ...staffForSelectQuery(filter),
    select: ({ core_staff }) => core_staff.map(({ person }) => person),
  });
}