import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, Sa_PublishInput } from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { activitiesKeys } from './keys';

const publishSchoolActivity = graphql(/* GraphQL */ `
  mutation sa_upsertPublish($input: Sa_PublishInput) {
    sa_upsertPublish(input: $input) {
      success
    }
  }
`);

export function usePublishSchoolActivity() {
  const { toast } = useToast();
  const { t } = useTranslation(['schoolActivities', 'common']);

  return useMutation({
    mutationFn: async (input: Sa_PublishInput) =>
      gqlClient.request(publishSchoolActivity, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(activitiesKeys.all);
      toast(t('schoolActivities:publishSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
