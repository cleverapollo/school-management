import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, StaffFilter } from '@tyro/api';
import { peopleStaffKeys } from './keys';

const staffPersonal = graphql(/* GraphQL */ `
  query core_staff_personal($filter: StaffFilter) {
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
      startDate
      endDate
      personalInformation {
        gender
        dateOfBirth
        ire {
          ppsNumber
        }
        primaryAddress {
          line1
          line2
          line3
          city
          country
          postCode
        }
        primaryPhoneNumber {
          number
          areaCode
          countryCode
        }
        phoneNumbers {
          primaryPhoneNumber
          number
          areaCode
          countryCode
        }
        primaryEmail {
          email
        }
        emails {
          email
          primaryEmail
        }
        nextOfKin {
          firstName
          lastName
          phoneNumbers
        }
      }
      staffIre {
        teacherCouncilNumber
        staffPost {
          id
          name
        }
      }
      payrollNumber
      employmentCapacity {
        id
        name
      }
      emergencyContact {
        firstName
        lastName
        primaryNumber
        additionalNumber
      }
      displayCode
      carRegistrationNumber
      makeAndModel
      parking
      jobSharing
      qualifications
      competencies
      availableForTeaching
      availableForSubstitution
      availableForSupportClasses
      position
      competency_subjects {
        id
        name
        colour
      }
    }
  }
`);

const staffPersonalQuery = (filter: StaffFilter) => ({
  queryKey: peopleStaffKeys.personalDetails(filter),
  queryFn: () => gqlClient.request(staffPersonal, { filter }),
});

export function getStaffPersonal(filter: StaffFilter) {
  return queryClient.fetchQuery(staffPersonalQuery(filter));
}

export function useStaffPersonal(filter: StaffFilter) {
  return useQuery({
    ...staffPersonalQuery(filter),
    select: ({ core_staff }) => core_staff[0],
  });
}
