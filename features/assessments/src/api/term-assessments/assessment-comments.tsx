import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AssessmentCommentFilter,
  AssessmentResultFilter,
  CommenterUserType,
  EmulateHeaders,
  gqlClient,
  graphql,
  queryClient,
  SaveAssessmentCommentInput,
  UseQueryReturnType,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { assessmentsKeys } from '../keys';

const assessmentComments = graphql(/* GraphQL */ `
  query assessment_assessmentComment($filter: AssessmentCommentFilter) {
    assessment_assessmentComment(filter: $filter) {
      id
      comment
      commentBankCommentId
      commenterUserType
      commenterPartyId
    }
  }
`);

const updateAssessmentComment = graphql(/* GraphQL */ `
  mutation assessment_saveAssessmentComments(
    $input: [SaveAssessmentCommentInput!]
  ) {
    assessment_saveAssessmentComments(input: $input) {
      id
    }
  }
`);

const assessmentCommentsQuery = (
  academicNamespaceId: number,
  filter: AssessmentCommentFilter
) => ({
  queryKey: assessmentsKeys.assessmentComments(academicNamespaceId, filter),
  queryFn: () =>
    gqlClient.request(
      assessmentComments,
      { filter },
      { [EmulateHeaders.ACADEMIC_NAMESPACE_ID]: academicNamespaceId.toString() }
    ),
});

export function useAssessmentComments(
  academicNamespaceId: number,
  filter: AssessmentCommentFilter
) {
  return useQuery({
    ...assessmentCommentsQuery(academicNamespaceId, filter),
    select: ({ assessment_assessmentComment }) =>
      (assessment_assessmentComment ?? []).reduce((acc, comment) => {
        acc.set(comment.commenterUserType, comment);
        return acc;
      }, new Map<CommenterUserType, NonNullable<typeof assessment_assessmentComment>[number]>()),
  });
}

export function useUpdateAssessmentComment(academicNamespaceId: number) {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: SaveAssessmentCommentInput[]) =>
      gqlClient.request(
        updateAssessmentComment,
        { input },
        {
          [EmulateHeaders.ACADEMIC_NAMESPACE_ID]:
            academicNamespaceId.toString(),
        }
      ),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries(assessmentsKeys.allAssessmentComments()),
        queryClient.invalidateQueries(
          assessmentsKeys.allOverallCommentsByYearGroup()
        ),
      ]);
      toast(t('common:snackbarMessages.updateSuccess'));
    },
  });
}

export type ReturnTypeFromUseAssessmentComments = UseQueryReturnType<
  typeof useAssessmentComments
>;
