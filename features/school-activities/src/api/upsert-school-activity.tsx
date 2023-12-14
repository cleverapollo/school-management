import { useMutation } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  Sa_SchoolActivityInput,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { groupsKeys } from '@tyro/groups';
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
      toast(
        variables?.schoolActivityId
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
      queryClient.invalidateQueries(activitiesKeys.all);
      queryClient.invalidateQueries(groupsKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
