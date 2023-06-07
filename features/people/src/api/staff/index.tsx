import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, StaffFilter } from '@tyro/api';
import { peopleStaffKeys } from './keys';

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
      employmentCapacity {
        name
      }
      startDate
      endDate
      personalInformation {
        gender
        primaryPhoneNumber {
          number
        }
        primaryEmail {
          email
        }
        ire {
          ppsNumber
        }
      }
      staffIre {
        teacherCouncilNumber
      }
      carRegistrationNumber
      parking
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

const staffQuery = (filter: StaffFilter) => ({
  queryKey: peopleStaffKeys.details(filter),
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
  queryKey: peopleStaffKeys.forSelect(filter),
  queryFn: async () => gqlClient.request(staffInfoForSelect, { filter }),
});

export function useStaffForSelect(filter: StaffFilter) {
  return useQuery({
    ...staffForSelectQuery(filter),
    select: ({ core_staff }) => core_staff.map(({ person }) => person),
  });
}
