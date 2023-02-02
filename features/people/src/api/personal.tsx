import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import dayjs from 'dayjs';

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
          partyId
          id
          line1
          line2
          line3
          city
          country
          postCode
          active
          primaryAddress
        }
        primaryPhoneNumber {
          partyId
          phoneNumberId
          number
          areaCode
          countryCode
          active
          primaryPhoneNumber
        }
        primaryEmail {
          partyId
          emailId
          email
          active
          primaryEmail
        }
      }
      studentIrePP {
        medicalCard
        travellerHeritage
        languageSupportApplicant
        borderIndicator
        examNumber
        previousSchoolRollNumber
      }
      contacts {
        partyId
        person {
          firstName
          lastName
          avatarUrl
          type
        }
      }
    }
  }
`);

// contacts {
//   partyId
//         person {
//     firstName
//     lastName
//     avatarUrl
//     type
//   }
//         relationships {
//     relationshipType
//     allowedToContact
//   }
// }

export const personalKeys = {
  all: ['people', 'student', 'personal'] as const,
  aboutDetails: (studentId: number | undefined) =>
    [...personalKeys.all, 'about', studentId] as const,
};

const studentPersonalQuery = (studentId: number | undefined) => ({
  queryKey: personalKeys.aboutDetails(studentId),
  queryFn: async () =>
    gqlClient.request(studentsPersonalById, {
      filter: { partyIds: [studentId ?? 0] },
    }),
  staleTime: 1000 * 60 * 2,
});

export function getStudentPersonal(studentId: number | undefined) {
  return queryClient.fetchQuery(studentPersonalQuery(studentId));
}

export function useStudentPersonal(studentId: number | undefined) {
  return useQuery({
    ...studentPersonalQuery(studentId),
    select: ({ core_students }) => {
      const student =
        Array.isArray(core_students) && core_students.length > 0
          ? core_students[0]
          : null;

      if (!student) return null;

      return {
        ...student,
        personalInformation: {
          ...student.personalInformation,
          dateOfBirth: student?.personalInformation?.dateOfBirth
            ? dayjs(student.personalInformation.dateOfBirth)
            : null,
        },
      };
    },
  });
}
