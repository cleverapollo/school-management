import { useQuery } from '@tanstack/react-query';

import {
  AssessmentSubjectGroupsFilter,
  UseQueryReturnType,
  gqlClient,
  graphql,
  queryClient,
  EmulateHeaders,
} from '@tyro/api';
import { assessmentsKeys } from './keys';

const assessmentSubjectGroupsList = graphql(/* GraphQL */ `
  query assessmentSubjectGroups($filter: AssessmentSubjectGroupsFilter) {
    assessment_assessmentSubjectGroups(filter: $filter) {
      subjectGroup {
        partyId
        name
        avatarUrl
        subjects {
          name
        }
        staff {
          partyId
          title {
            id
            name
            nameTextId
          }
          avatarUrl
          firstName
          lastName
        }
        yearGroups {
          yearGroupId
          name
        }
      }
      resultsTotal
      resultsEntered
      commentsEntered
      commentsTotal
      extraFieldResultsEntered
      ppodSyncStatus
      published
    }
  }
`);

const assessmentSubjectGroupsQuery = (
  academicNamespaceId: number,
  filter: AssessmentSubjectGroupsFilter
) => ({
  queryKey: assessmentsKeys.resultsBySubjectGroup(academicNamespaceId, filter),
  queryFn: () =>
    gqlClient.request(
      assessmentSubjectGroupsList,
      { filter },
      {
        [EmulateHeaders.ACADEMIC_NAMESPACE_ID]: academicNamespaceId.toString(),
      }
    ),
});

export function getAssessmentSubjectGroups(
  academicNamespaceId: number,
  filter: AssessmentSubjectGroupsFilter
) {
  return queryClient.fetchQuery(
    assessmentSubjectGroupsQuery(academicNamespaceId, filter)
  );
}

export function useAssessmentSubjectGroups(
  academicNamespaceId: number,
  filter: AssessmentSubjectGroupsFilter,
  enabled = true
) {
  return useQuery({
    ...assessmentSubjectGroupsQuery(academicNamespaceId, filter),
    enabled,
    select: ({ assessment_assessmentSubjectGroups }) => {
      if (!Array.isArray(assessment_assessmentSubjectGroups)) return [];

      return assessment_assessmentSubjectGroups;
    },
  });
}

export type ReturnTypeFromUseAssessmentSubjectGroups = UseQueryReturnType<
  typeof useAssessmentSubjectGroups
>[number];
