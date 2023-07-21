import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
import { peopleKeys } from '../../keys';

const studentMedicalData = graphql(/* GraphQL */ `
  query wellbeing_studentMedical($filter: StudentMedicalFilter) {
    wellbeing_studentMedical(filter: $filter) {
      studentPartyId
      student {
        contacts {
          partyId
          person {
            firstName
            lastName
          }
          personalInformation {
            preferredFirstName
            preferredLastName
            primaryPhoneNumber {
              number
            }
          }
          relationships {
            relationshipType
          }
        }
        siblings {
          enrolledSiblings {
            partyId
            person {
              title {
                id
                nameTextId
                name
              }
              firstName
              lastName
              avatarUrl
              type
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
      conditions {
        id
        name
        description
        equipment {
          id
          name
          expiryDate
          location
          notes
        }
        emergencyPlan
      }
      medicalContacts {
        id
        personalTitle
        firstName
        lastName
        occupation
        addressLine1
        addressLine2
        addressLine3
        county
        postcode
        primaryPhone
        email
      }
    }
  }
`);

const studentMedicalDataQuery = (studentId: number) => ({
  queryKey: peopleKeys.students.medical(studentId),
  queryFn: async () =>
    gqlClient.request(studentMedicalData, {
      filter: { studentPartyId: studentId ?? 0 },
    }),
});

export function getStudentMedicalData(studentId: number) {
  return queryClient.fetchQuery(studentMedicalDataQuery(studentId));
}

export function useStudentMedicalData(studentId: number) {
  return useQuery({
    ...studentMedicalDataQuery(studentId),
    select: ({ wellbeing_studentMedical }) => wellbeing_studentMedical,
  });
}

export type ReturnTypeFromUseStudentMedical = UseQueryReturnType<
  typeof useStudentMedicalData
>;
