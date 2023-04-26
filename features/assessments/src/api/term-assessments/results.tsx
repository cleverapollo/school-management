import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  AssessmentResultFilter,
  EmulateHeaders,
  gqlClient,
  graphql,
  queryClient,
  SaveAssessmentResultInput,
  UseQueryReturnType,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { assessmentsKeys } from '../keys';

const assessmentResults = graphql(/* GraphQL */ `
  query assessment_assessmentResult($filter: AssessmentResultFilter) {
    assessment_assessmentResult(filter: $filter) {
      id
      assessmentId
      studentPartyId
      student {
        title
        firstName
        lastName
        avatarUrl
        type
      }
      studentClassGroup
      studentProgramme {
        shortName
      }
      subjectGroup {
        partyId
        name
      }
      studentStudyLevel
      result
      targetResult
      gradeResult
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
  const { data, ...rest } = useQuery({
    ...assessmentResultsQuery(academicNamespaceId, filter ?? {}),
    enabled: !!filter,
  });

  const mappedData = useMemo(
    () =>
      data?.assessment_assessmentResult?.map((result) => {
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
    [data]
  );

  return {
    data: mappedData,
    ...rest,
  };
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
