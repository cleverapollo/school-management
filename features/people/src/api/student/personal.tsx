import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { peopleStudentsKeys } from './keys';

const studentsPersonalById = graphql(/* GraphQL */ `
  query core_student_personal($filter: StudentFilter!) {
    core_students(filter: $filter) {
      partyId
      personalInformation {
        firstName
        lastName
        preferredFirstName
        middleName
        gender
        dateOfBirth
        ire {
          ppsNumber
          religion
          countryOfBirth
        }
        nationality
        mothersMaidenName
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
        primaryEmail {
          email
        }
      }
      studentIrePP {
        medicalCard
        travellerHeritage
        languageSupportApplicant
        borderIndicator
        examNumber
        lockerNumber
        previousSchoolRollNumber
      }
    }
  }
`);

const studentPersonalQuery = (studentId: number | undefined) => ({
  queryKey: peopleStudentsKeys.personalDetails(studentId),
  queryFn: async () =>
    gqlClient.request(studentsPersonalById, {
      filter: { partyIds: [studentId ?? 0] },
    }),
});

export function getStudentPersonal(studentId: number | undefined) {
  return queryClient.fetchQuery(studentPersonalQuery(studentId));
}

export function useStudentPersonal(studentId: number | undefined) {
  return useQuery({
    ...studentPersonalQuery(studentId),
    select: ({ core_students }) => core_students[0],
  });
}
