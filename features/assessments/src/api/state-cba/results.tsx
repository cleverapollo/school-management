import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  AssessmentResultFilter,
  Assessment_AssessmentResultQuery,
  EmulateHeaders,
  UseQueryReturnType,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { assessmentsKeys } from '../keys';

const stateCbaResults = graphql(/* GraphQL */ `
  query assessment_stateCbaResult($filter: AssessmentResultFilter) {
    assessment_assessmentResult(filter: $filter) {
      assessmentId
      ppodPublished
      ppodResult
      examinable
      studentPartyId
      subjectGroup {
        name
        programmeStages {
          name
          shortName
        }
      }
      studentClassGroup
      subjectGroupId
      studentStudyLevel
      student {
        person {
          avatarUrl
          firstName
          lastName
        }
      }
      result
      gradeResult
      gradeId
      excluded
      ppodPublishedOn
    }
  }
`);

const stateCbaResultsQuery = (
  academicNamespaceId: number,
  filter: AssessmentResultFilter
) => ({
  queryKey: assessmentsKeys.resultsBySubjectGroup(
    academicNamespaceId,
    filter ?? {}
  ),
  queryFn: () =>
    gqlClient.request(
      stateCbaResults,
      { filter },
      { [EmulateHeaders.ACADEMIC_NAMESPACE_ID]: academicNamespaceId.toString() }
    ),
});

export function getStateCbaResults(
  academicNamespaceId: number,
  filter: AssessmentResultFilter
) {
  return queryClient.fetchQuery(
    stateCbaResultsQuery(academicNamespaceId, filter)
  );
}

export function useStateCbaResults(
  academicNamespaceId: number,
  filter: AssessmentResultFilter | null
) {
  return useQuery({
    ...stateCbaResultsQuery(academicNamespaceId, filter ?? {}),
    // @ts-ignore
    enabled: !!filter,
    select: useCallback(
      ({ assessment_assessmentResult }: Assessment_AssessmentResultQuery) =>
        assessment_assessmentResult?.map((result) => {
          const extraFields =
            result?.extraFields?.reduce((acc, extraField) => {
              acc[extraField.assessmentExtraFieldId] = extraField;
              return acc;
            }, {} as Record<number, NonNullable<(typeof result)['extraFields']>[number]>) ??
            {};
          console.log(extraFields, 'extraFields');

          return {
            ...result,
            extraFields,
          };
        }),
      []
    ),
  });
}

export type ReturnTypeFromUseStateCbaResults = UseQueryReturnType<
  typeof useStateCbaResults
>[number];
