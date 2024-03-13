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
  staleTime: 0,
  queryFn: async () =>
    gqlClient.request(printAssessment, {
      filter,
    }),
});

export function getPrintAssessment(filter: Print_AssessmentOptions) {
  return queryClient.fetchQuery(printAssessmentQuery(filter));
}

export function usePrintAssessment(filter: Print_AssessmentOptions | null) {
  return useQuery({
    ...printAssessmentQuery(filter ?? ({} as Print_AssessmentOptions)),
    select: ({ print_assessment }) => print_assessment,
    enabled: !!filter,
  });
}

export type ReturnTypeFromUsePrintAssessment = UseQueryReturnType<
  typeof usePrintAssessment
>;
