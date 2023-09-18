import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, StaffFilter } from '@tyro/api';
import { sortByDisplayName } from '@tyro/core';
import { peopleKeys } from '../keys';

const staff = graphql(/* GraphQL */ `
  query core_staff($filter: StaffFilter) {
    core_staff(filter: $filter) {
      partyId
      person {
        title {
          id
          name
          nameTextId
        }
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
        staffPost {
          id
          name
        }
      }
      carRegistrationNumber
      parking
      position
    }
  }
`);

const staffInfoForSelect = graphql(/* GraphQL */ `
  query core_staffInfoForSelect($filter: StaffFilter) {
    core_staff(filter: $filter) {
      person {
        partyId
        title {
          nameTextId
          id
          name
        }
        firstName
        lastName
        avatarUrl
        type
      }
    }
  }
`);

const staffQuery = (filter: StaffFilter) => ({
  queryKey: peopleKeys.staff.details(filter),
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
  queryKey: peopleKeys.staff.forSelect(filter),
  queryFn: async () => {
    const { core_staff: staffData = [] } = await gqlClient.request(
      staffInfoForSelect,
      { filter }
    );

    return {
      core_staff: staffData.map(({ person }) => person).sort(sortByDisplayName),
    };
  },
});

export function getStaffForSelect(filter: StaffFilter) {
  return queryClient.fetchQuery(staffForSelectQuery(filter));
}

export function useStaffForSelect(filter: StaffFilter) {
  return useQuery({
    ...staffForSelectQuery(filter),
    select: ({ core_staff }) => core_staff,
  });
}
