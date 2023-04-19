import { useQuery } from '@tanstack/react-query';

import { AssessmentFilter, gqlClient, graphql, queryClient } from '@tyro/api';

const assessmentsList = graphql(/* GraphQL */ `
  query assessmentsList($filter: AssessmentFilter) {
    assessment_assessment(filter: $filter) {
      id
      name
      assessmentType
      academicNamespaceId
      years {
        yearGroupId
        name
      }
      publish
      createdOn
      createdBy {
        type
        title
        firstName
        lastName
        avatarUrl
      }
    }
  }
`);

export const assessmentsKeys = {
  list: (filter: AssessmentFilter) => ['assessments', filter] as const,
};

const assessmentsQuery = (filter: AssessmentFilter) => ({
  queryKey: assessmentsKeys.list(filter),
  queryFn: () => gqlClient.request(assessmentsList, { filter }),
});

export function getAssessments(filter: AssessmentFilter) {
  return queryClient.fetchQuery(assessmentsQuery(filter));
}

export function useAssessments(filter: AssessmentFilter) {
  return useQuery({
    ...assessmentsQuery(filter),
    select: ({ assessment_assessment }) => {
      if (!Array.isArray(assessment_assessment)) return [];

      return assessment_assessment;
    },
  });
}
