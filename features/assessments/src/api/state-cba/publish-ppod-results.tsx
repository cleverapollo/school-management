import { useMutation } from '@tanstack/react-query';
import {
  PpodPublishResultsInput,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { assessmentsKeys } from '../keys';

const publishResultsToPpod = graphql(/* GraphQL */ `
  mutation assessment_publishPPODResults($input: PPODPublishResultsInput) {
    assessment_publishPPODResults(input: $input) {
      id
      assessmentId
      studentPartyId
    }
  }
`);

export function usePublishResultsToPpod() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: PpodPublishResultsInput) =>
      gqlClient.request(publishResultsToPpod, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(assessmentsKeys.all);
      toast(t('common:snackbarMessages.createSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
