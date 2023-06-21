import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { peopleStudentsKeys } from './keys';

const studentsPersonalById = graphql(/* GraphQL */ `
  query core_student_personal($filter: StudentFilter!) {
    core_students(filter: $filter) {
      partyId
      startDate
      leftEarly
      endDate
      personalInformation {
        firstName
        lastName
        preferredFirstName
        middleName
        gender
        dateOfBirth
        birthCertFirstName
        birthCertLastName
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
        addresses {
          line1
          line2
          line3
          city
          country
          postCode
          primaryAddress
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
        dpin
        examEntrant
        repeatYear
        boardingDays
        shortTermPupil
        shortTermPupilNumWeeks
        repeatLeaving
        reasonForLeaving
        destinationRollNo
        previousSchoolName
        previousSchoolType
      }
      classGroup {
        name
      }
      tutors {
        partyId
        firstName
        lastName
        avatarUrl
      }
      yearGroupLeads {
        partyId
        firstName
        lastName
        avatarUrl
      }
      yearGroups {
        name
      }
      programmeStages {
        name
        programme {
          name
        }
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
