import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
import { peopleKeys } from '../../keys';

const studentAenData = graphql(/* GraphQL */ `
  query wellbeing_studentAen($filter: StudentAenFilter!) {
    wellbeing_studentAen(filter: $filter) {
      studentPartyId
      entries {
        id
        studentPartyId
        startDate
        endDate
        type
        typeNote
        contact
        snaSupport
        provision
        note
      }
    }
  }
`);

const studentAenDataQuery = (studentId: number) => ({
  queryKey: peopleKeys.students.aen(studentId),
  queryFn: async () =>
    gqlClient.request(studentAenData, {
      filter: { studentPartyId: studentId ?? 0 },
    }),
});

export function getStudentAenData(studentId: number) {
  return queryClient.fetchQuery(studentAenDataQuery(studentId));
}

export function useStudentAenData(studentId: number) {
  return useQuery({
    ...studentAenDataQuery(studentId),
    select: ({ wellbeing_studentAen }) => wellbeing_studentAen,
  });
}

export type ReturnTypeFromUseStudentAen = UseQueryReturnType<
  typeof useStudentAenData
>;
