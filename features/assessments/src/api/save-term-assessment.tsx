import { useMutation } from '@tanstack/react-query';
import {
  EmulateHeaders,
  gqlClient,
  graphql,
  queryClient,
  SaveAssessmentInput,
  useAcademicNamespace,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { assessmentsKeys } from './keys';

const saveTermAssessment = graphql(/* GraphQL */ `
  mutation saveTermAssessment($input: SaveAssessmentInput) {
    assessment_saveAssessment(input: $input) {
      name
      years {
        name
      }
      startDate
      endDate
    }
  }
`);

export function useSaveTermAssessment(academicNameSpaceId?: number) {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);
  const { activeAcademicNamespace } = useAcademicNamespace();

  return useMutation({
    mutationFn: (input: SaveAssessmentInput) =>
      gqlClient.request(
        saveTermAssessment,
        { input },
        {
          [EmulateHeaders.ACADEMIC_NAMESPACE_ID]: (
            academicNameSpaceId ??
            activeAcademicNamespace?.academicNamespaceId ??
            0
          )?.toString(),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(assessmentsKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
