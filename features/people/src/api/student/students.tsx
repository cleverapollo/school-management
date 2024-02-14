import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  StudentFilter,
  UpdateStudentInput,
  UseQueryReturnType,
} from '@tyro/api';
import { BulkEditedRows, sortByDisplayName } from '@tyro/core';
import { peopleKeys } from '../keys';

const students = graphql(/* GraphQL */ `
  query core_students {
    core_students {
      partyId
      person {
        partyId
        avatarUrl
        firstName
        lastName
        type
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
        dateOfBirth
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
        dpin
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
      extensions {
        priority
      }
    }
  }
`);

const studentById = graphql(/* GraphQL */ `
  query core_student($filter: StudentFilter!) {
    core_students(filter: $filter) {
      partyId
      person {
        partyId
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
      extensions {
        priority
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
      classGroup {
        name
      }
      yearGroups {
        name
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

export function useStudent(studentId: number | undefined, enabled = true) {
  return useQuery({
    ...studentQuery(studentId),
    select: ({ core_students }) =>
      Array.isArray(core_students) && core_students.length > 0
        ? core_students[0]
        : null,
    enabled: !!studentId && enabled,
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
  queryFn: async () => {
    const { core_students: studentsData = [] } = await gqlClient.request(
      studentsInfoForSelect,
      { filter }
    );

    return {
      core_students: studentsData
        .map(({ person, yearGroups, classGroup }) => {
          const caption = [
            ...yearGroups.map((group) => group.name),
            classGroup?.name,
          ]
            .filter(Boolean)
            .join(', ');

          return {
            ...person,
            ...(caption && { caption }),
          };
        })
        .sort(sortByDisplayName),
    };
  },
});

export function getStudentsForSelect(filter: StudentFilter) {
  return queryClient.fetchQuery(studentsForSelectQuery(filter));
}

export function useStudentsForSelect(filter: StudentFilter) {
  return useQuery({
    ...studentsForSelectQuery(filter),
    select: ({ core_students }) => core_students,
  });
}

export type StudentsSelectOption = UseQueryReturnType<
  typeof useStudentsForSelect
>;

export type StudentSelectOption = StudentsSelectOption[number];
