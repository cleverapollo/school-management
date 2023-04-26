import { useQuery } from '@tanstack/react-query';
import {
  CalculateGradeFilter,
  EmulateHeaders,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { assessmentsKeys } from '../keys';

const calculateGrade = graphql(/* GraphQL */ `
  query assessment_calculateGrade($filter: CalculateGradeFilter) {
    assessment_calculateGrade(filter: $filter) {
      grade
    }
  }
`);

const calculateGradeQuery = (
  academicNamespaceId: number,
  filter: CalculateGradeFilter
) => ({
  queryKey: assessmentsKeys.calculateGrade(academicNamespaceId, filter),
  queryFn: () =>
    gqlClient.request(
      calculateGrade,
      { filter },
      { [EmulateHeaders.ACADEMIC_NAMESPACE_ID]: academicNamespaceId.toString() }
    ),
  staleTime: Infinity,
});

export function getCalculateGrade(
  academicNamespaceId: number,
  filter: CalculateGradeFilter
) {
  return queryClient.fetchQuery(
    calculateGradeQuery(academicNamespaceId, filter)
  );
}

export function useCalculateGrade(
  academicNamespaceId: number,
  filter: CalculateGradeFilter
) {
  return useQuery({
    ...calculateGradeQuery(academicNamespaceId, filter),
    enabled: !!filter,
    select: ({ assessment_calculateGrade }) => assessment_calculateGrade.grade,
  });
}
