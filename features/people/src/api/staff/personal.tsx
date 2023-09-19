import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, StaffFilter } from '@tyro/api';
import { peopleKeys } from '../keys';

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
      noLongerStaffMember
      personalInformation {
        gender
        dateOfBirth
        ire {
          ppsNumber
        }
        primaryAddress {
          id
          line1
          line2
          line3
          city
          country
          postCode
        }
        primaryPhoneNumber {
          phoneNumberId
          number
          areaCode
          countryCode
        }
        phoneNumbers {
          phoneNumberId
          primaryPhoneNumber
          number
          areaCode
          countryCode
        }
        primaryEmail {
          emailId
          email
        }
        emails {
          emailId
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
      competencySubjects {
        id
        name
        colour
      }
    }
  }
`);

const staffPersonalQuery = (filter: StaffFilter) => ({
  queryKey: peopleKeys.staff.personalDetails(filter),
  queryFn: () => gqlClient.request(staffPersonal, { filter }),
});

export function getStaffPersonal(filter: StaffFilter) {
  return queryClient.fetchQuery(staffPersonalQuery(filter));
}

export function useStaffPersonal(filter: StaffFilter) {
  return useQuery({
    ...staffPersonalQuery(filter),
    select: ({ core_staff }) => {
      const [staff] = core_staff;

      return {
        ...staff,
        isCurrentEmployee: !staff.noLongerStaffMember,
      };
    },
  });
}
