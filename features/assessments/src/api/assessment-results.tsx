import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  AssessmentResultFilter,
  Assessment_AssessmentResultQuery,
  EmulateHeaders,
  gqlClient,
  graphql,
  queryClient,
  SaveAssessmentResultInput,
  UseQueryReturnType,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { assessmentsKeys } from './keys';

const assessmentResults = graphql(/* GraphQL */ `
  query assessment_assessmentResult($filter: AssessmentResultFilter) {
    assessment_assessmentResult(filter: $filter) {
      id
      assessmentId
      studentPartyId
      student {
        person {
          partyId
          title {
            id
            name
            nameTextId
          }
          firstName
          lastName
          avatarUrl
          type
        }
        extensions {
          priority
        }
      }
      studentClassGroup
      studentProgramme {
        shortName
      }
      subjectGroup {
        partyId
        name
        irePP {
          examinable
        }
      }
      studentStudyLevel
      result
      targetResult
      gradeResult
      gradeId
      gradeNameTextId
      targetGradeResult
      targetGradeNameTextId
      teacherComment {
        id
        assessmentId
        studentPartyId
        comment
        commentBankCommentId
        commenterUserType
        commenterPartyId
        subjectGroupPartyId
      }
      extraFields {
        id
        extraFieldType
        assessmentResultId
        assessmentExtraFieldId
        result
        gradeSetGradeId
        gradeNameTextId
        commentBankCommentId
      }
      examinable
      ppodPublished
      ppodResult
    }
  }
`);

const updateAssessmentResult = graphql(/* GraphQL */ `
  mutation assessment_saveAssessmentResults(
    $input: [SaveAssessmentResultInput!]
  ) {
    assessment_saveAssessmentResults(input: $input) {
      id
    }
  }
`);

const assessmentResultsQuery = (
  academicNamespaceId: number,
  filter: AssessmentResultFilter
) => ({
  queryKey: assessmentsKeys.resultsBySubjectGroup(
    academicNamespaceId,
    filter ?? {}
  ),
  queryFn: () =>
    gqlClient.request(
      assessmentResults,
      { filter },
      { [EmulateHeaders.ACADEMIC_NAMESPACE_ID]: academicNamespaceId.toString() }
    ),
});

export function getAssessmentResults(
  academicNamespaceId: number,
  filter: AssessmentResultFilter
) {
  return queryClient.fetchQuery(
    assessmentResultsQuery(academicNamespaceId, filter)
  );
}

export function useAssessmentResults(
  academicNamespaceId: number,
  filter: AssessmentResultFilter | null
) {
  return useQuery({
    ...assessmentResultsQuery(academicNamespaceId, filter ?? {}),
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

          return {
            ...result,
            extraFields,
          };
        }),
      []
    ),
  });
}

export type ReturnTypeFromUseAssessmentResults = UseQueryReturnType<
  typeof useAssessmentResults
>[number];

export function useUpdateAssessmentResult(
  academicNamespaceId: number,
  assessmentFilter: AssessmentResultFilter
) {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: SaveAssessmentResultInput[]) =>
      gqlClient.request(
        updateAssessmentResult,
        { input },
        {
          [EmulateHeaders.ACADEMIC_NAMESPACE_ID]:
            academicNamespaceId.toString(),
        }
      ),
    onSuccess: () => {
      toast(t('common:snackbarMessages.updateSuccess'));
      queryClient.invalidateQueries(
        assessmentsKeys.resultsBySubjectGroup(academicNamespaceId, {
          assessmentId: assessmentFilter.assessmentId,
        })
      );
    },
  });
}
