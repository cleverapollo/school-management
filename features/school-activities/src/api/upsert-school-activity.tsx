import { useMutation } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  Sa_SchoolActivityInput,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { activitiesKeys } from './keys';

const saveSchoolActivies = graphql(/* GraphQL */ `
  mutation sa_upsertActivity($input: Sa_SchoolActivityInput) {
    sa_upsertActivity(input: $input) {
      success
    }
  }
`);

export function useSaveSchoolActivities() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Sa_SchoolActivityInput) =>
      gqlClient.request(saveSchoolActivies, { input }),
    onSuccess: (_, variables) => {
      if (variables?.schoolActivityId) {
        toast(t('common:snackbarMessages.updateSuccess'));
      } else {
        toast(t('common:snackbarMessages.createSuccess'));
      }
      queryClient.invalidateQueries(activitiesKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
