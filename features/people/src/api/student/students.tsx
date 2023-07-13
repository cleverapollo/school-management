import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  StudentFilter,
  UpdateStudentInput,
  UseQueryReturnType,
} from '@tyro/api';
import { BulkEditedRows } from '@tyro/core';
import { peopleKeys } from '../keys';

const students = graphql(/* GraphQL */ `
  query core_students {
    core_students {
      partyId
      person {
        avatarUrl
        firstName
        lastName
      }
      classGroup {
        name
        staff {
          firstName
          lastName
        }
      }
      personalInformation {
        preferredFirstName
        primaryPhoneNumber {
          number
        }
        primaryEmail {
          email
        }
      }
      studentIrePP {
        examNumber
        previousSchoolName
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
        id
        name
        programme {
          name
        }
      }
    }
  }
`);

const studentById = graphql(/* GraphQL */ `
  query core_student($filter: StudentFilter!) {
    core_students(filter: $filter) {
      partyId
      person {
        avatarUrl
        firstName
        lastName
      }
      classGroup {
        name
        staff {
          firstName
          lastName
        }
      }
      yearGroupLeads {
        firstName
        lastName
        avatarUrl
      }
      yearGroups {
        shortName
      }
      tutors {
        partyId
        firstName
        lastName
        avatarUrl
        type
      }
    }
  }
`);

const studentsInfoForSelect = graphql(/* GraphQL */ `
  query core_studentsInfoForSelect($filter: StudentFilter) {
    core_students(filter: $filter) {
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
    }
  }
`);

const bulkUpdateCoreStudent = graphql(/* GraphQL */ `
  mutation updateCoreStudents($input: [UpdateStudentInput]!) {
    core_updateStudents(input: $input) {
      success
    }
  }
`);

const studentsQuery = {
  queryKey: peopleKeys.students.all(),
  queryFn: async () => gqlClient.request(students),
};

export function getStudents() {
  return queryClient.fetchQuery(studentsQuery);
}

export function useStudents() {
  return useQuery({
    ...studentsQuery,
    select: ({ core_students }) => core_students,
  });
}

const studentQuery = (studentId: number | undefined) => ({
  queryKey: peopleKeys.students.details(studentId),
  queryFn: async () =>
    gqlClient.request(studentById, {
      filter: { partyIds: [studentId ?? 0] },
    }),
});

export function getStudent(studentId: number | undefined) {
  return queryClient.fetchQuery(studentQuery(studentId));
}

export type ReturnTypeFromUseStudent = UseQueryReturnType<typeof useStudent>;

export type ReturnTypeFromUseStudents = UseQueryReturnType<
  typeof useStudents
>[number];

export function useStudent(studentId: number | undefined) {
  return useQuery({
    ...studentQuery(studentId),
    select: ({ core_students }) => {
      const student =
        Array.isArray(core_students) && core_students.length > 0
          ? core_students[0]
          : null;
      // Adding mock data for demo purposes
      return {
        ...student,
      };
    },
    enabled: !!studentId,
  });
}

export function useBulkUpdateCoreStudent() {
  return useMutation({
    mutationFn: (
      input: BulkEditedRows<
        ReturnTypeFromUseStudents,
        | 'personalInformation.preferredFirstName'
        | 'personalInformation.primaryPhoneNumber.number'
        | 'personalInformation.primaryEmail.email'
        | 'studentIrePP.examNumber'
      >
    ) => {
      const dataForEndpoint = Object.keys(input).map<UpdateStudentInput>(
        (id) => ({
          studentPartyId: Number(id),
          preferredName:
            input[id]['personalInformation.preferredFirstName']?.newValue,
          primaryPhoneNumber:
            input[id]['personalInformation.primaryPhoneNumber.number']
              ?.newValue,
          primaryEmail:
            input[id]['personalInformation.primaryEmail.email']?.newValue,
          examNumber: input[id]['studentIrePP.examNumber']?.newValue,
        })
      );

      return gqlClient.request(bulkUpdateCoreStudent, {
        input: dataForEndpoint,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(peopleKeys.students.all());
    },
  });
}

const studentsForSelectQuery = (filter: StudentFilter) => ({
  queryKey: peopleKeys.students.forSelect(filter),
  queryFn: async () => gqlClient.request(studentsInfoForSelect, { filter }),
});

export function getStudentsForSelect(filter: StudentFilter) {
  return queryClient.fetchQuery(studentsForSelectQuery(filter));
}

export function useStudentsForSelect(filter: StudentFilter) {
  return useQuery({
    ...studentsForSelectQuery(filter),
    select: ({ core_students }) => {
      if (!Array.isArray(core_students)) return [];

      return core_students.map(({ person }) => person);
    },
  });
}

export type StudentSelectOption = UseQueryReturnType<
  typeof useStudentsForSelect
>[number];
