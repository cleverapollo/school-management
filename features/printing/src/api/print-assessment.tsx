import { useQuery } from '@tanstack/react-query';
import {
  EmulateHeaders,
  gqlClient,
  graphql,
  Print_AssessmentOptions,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';

export type PrintAssessmentOptions = Print_AssessmentOptions & {
  academicNameSpaceId: number;
};

const printAssessment = graphql(/* GraphQL */ `
  query printAssessment($filter: Print_AssessmentOptions!) {
    print_assessment(filter: $filter) {
      url
      html
    }
  }
`);

const printAssessmentQuery = ({
  academicNameSpaceId,
  ...filter
}: PrintAssessmentOptions) => ({
  queryKey: ['print', 'assessment', filter],
  staleTime: 0,
  queryFn: async () =>
    gqlClient.request(
      printAssessment,
      {
        filter,
      },
      {
        [EmulateHeaders.ACADEMIC_NAMESPACE_ID]: academicNameSpaceId.toString(),
      }
    ),
});

export function getPrintAssessment(filter: PrintAssessmentOptions) {
  return queryClient.fetchQuery(printAssessmentQuery(filter));
}

export function usePrintAssessment(filter: PrintAssessmentOptions | null) {
  return useQuery({
    ...printAssessmentQuery(filter ?? ({} as PrintAssessmentOptions)),
    select: ({ print_assessment }) => print_assessment,
    enabled: !!filter,
  });
}

export type ReturnTypeFromUsePrintAssessment = UseQueryReturnType<
  typeof usePrintAssessment
>;
