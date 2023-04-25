import { useQuery } from '@tanstack/react-query';
import {
  CalculateGradeFilter,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';

const calculateGrade = graphql(/* GraphQL */ `
  query assessment_calculateGrade($filter: CalculateGradeFilter) {
    assessment_calculateGrade(filter: $filter) {
      grade
    }
  }
`);

export const assessmentGradeKeys = {
  grade: (filter: CalculateGradeFilter) =>
    ['assessments', 'grade', filter] as const,
};

const calculateGradeQuery = (filter: CalculateGradeFilter) => ({
  queryKey: assessmentGradeKeys.grade(filter),
  queryFn: () => gqlClient.request(calculateGrade, { filter }),
  staleTime: Infinity,
});

export function getCalculateGrade(filter: CalculateGradeFilter) {
  return queryClient.fetchQuery(calculateGradeQuery(filter));
}

export function useCalculateGrade(filter: CalculateGradeFilter) {
  return useQuery({
    ...calculateGradeQuery(filter),
    enabled: !!filter,
    select: ({ assessment_calculateGrade }) => assessment_calculateGrade.grade,
  });
}
