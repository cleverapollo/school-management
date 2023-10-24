import { useMutation } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  SaveAssessmentInput,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { assessmentsKeys } from './keys';

const saveTermAssessment = graphql(/* GraphQL */ `
  mutation saveAssessment($input: SaveAssessmentInput) {
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

export function useSaveTermAssessment() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: SaveAssessmentInput) =>
      gqlClient.request(saveTermAssessment, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(assessmentsKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
