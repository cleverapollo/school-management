import { useQuery } from '@tanstack/react-query';

import {
  AssessmentSubjectGroupsFilter,
  UseQueryReturnType,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { assessmentsKeys } from './keys';

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

const assessmentSubjectGroupsQuery = (
  filter: AssessmentSubjectGroupsFilter
) => ({
  queryKey: assessmentsKeys.resultsBySubjectGroup(filter),
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
