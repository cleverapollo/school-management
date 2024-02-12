import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Print_AssessmentOptions,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';

const printAssessment = graphql(/* GraphQL */ `
  query printAssessment($filter: Print_AssessmentOptions!) {
    print_assessment(filter: $filter) {
      url
      html
    }
  }
`);

const printAssessmentQuery = (filter: Print_AssessmentOptions) => ({
  queryKey: ['print', 'assessment', filter],
  queryFn: async () =>
    gqlClient.request(printAssessment, {
      filter,
    }),
});

export function getPrintAssessment(filter: Print_AssessmentOptions) {
  return queryClient.fetchQuery(printAssessmentQuery(filter));
}

export function usePrintAssessment(filter: Print_AssessmentOptions) {
  return useQuery({
    ...printAssessmentQuery(filter),
    select: ({ print_assessment }) => print_assessment,
  });
}

export type ReturnTypeFromUsePrintAssessment = UseQueryReturnType<
  typeof usePrintAssessment
>;
