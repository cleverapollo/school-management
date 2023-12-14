import { useMutation } from '@tanstack/react-query';
import {
  AssessmentResultFilter,
  EmulateHeaders,
  gqlClient,
  graphql,
  queryClient,
  SaveAssessmentResultInput,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { assessmentsKeys } from '../keys';

const updateStateCbaResult = graphql(/* GraphQL */ `
  mutation assessment_saveAssessmentResults(
    $input: [SaveAssessmentResultInput!]
  ) {
    assessment_saveAssessmentResults(input: $input) {
      id
    }
  }
`);

export function useUpdateStateCbaResult(
  academicNamespaceId: number,
  assessmentFilter: AssessmentResultFilter
) {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: SaveAssessmentResultInput[]) =>
      gqlClient.request(
        updateStateCbaResult,
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
