import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
import { peopleKeys } from '../keys';

const studentsPersonalById = graphql(/* GraphQL */ `
  query core_student_personal($filter: StudentFilter!) {
    core_students(filter: $filter) {
      partyId
      startDate
      leftEarly
      endDate
      guardianshipNote
      exemptions {
        id
        exemption
        exemptionTypeCode
        grantor
      }
      person {
        partyId
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        avatarUrl
        type
      }
      personalInformation {
        firstName
        lastName
        preferredFirstName
        preferredLastName
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
      siblings {
        enrolledSiblings {
          partyId
          person {
            partyId
            title {
              id
              nameTextId
              name
            }
            firstName
            lastName
            avatarUrl
          }
          classGroup {
            name
          }
        }
        nonEnrolledSiblings {
          partyId
          firstName
          lastName
        }
      }
    }
  }
`);

const studentPersonalQuery = (studentId: number | undefined) => ({
  queryKey: peopleKeys.students.personalDetails(studentId),
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

export type ReturnTypeFromUseStudentPersonal = UseQueryReturnType<
  typeof useStudentPersonal
>;
