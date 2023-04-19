import { useQuery } from '@tanstack/react-query';

import {
  AssessmentSubjectGroupsFilter,
  UseQueryReturnType,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';

const assessmentSubjectGroupsList = graphql(/* GraphQL */ `
  query assessmentSubjectGroups($filter: AssessmentSubjectGroupsFilter) {
    assessment_assessmentSubjectGroups(filter: $filter) {
      subjectGroupId
      subject
      subjectGroupName
      resultsTotal
      resultsEntered
      commentsEntered
      commentsTotal
    }
  }
`);

export const assessmentSubjectGroupsKeys = {
  list: (filter: AssessmentSubjectGroupsFilter) =>
    ['assessments', 'subjectGroups', filter] as const,
};

const assessmentSubjectGroupsQuery = (
  filter: AssessmentSubjectGroupsFilter
) => ({
  queryKey: assessmentSubjectGroupsKeys.list(filter),
  queryFn: () => gqlClient.request(assessmentSubjectGroupsList, { filter }),
});

export function getAssessmentSubjectGroups(
  filter: AssessmentSubjectGroupsFilter
) {
  return queryClient.fetchQuery(assessmentSubjectGroupsQuery(filter));
}

export function useAssessmentSubjectGroups(
  filter: AssessmentSubjectGroupsFilter
) {
  return useQuery({
    ...assessmentSubjectGroupsQuery(filter),
    select: ({ assessment_assessmentSubjectGroups }) => {
      if (!Array.isArray(assessment_assessmentSubjectGroups)) return [];

      return assessment_assessmentSubjectGroups;
    },
  });
}

export type ReturnTypeFromUseAssessmentSubjectGroups = UseQueryReturnType<
  typeof useAssessmentSubjectGroups
>[number];
