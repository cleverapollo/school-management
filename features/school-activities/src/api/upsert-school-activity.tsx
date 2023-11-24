import { useMutation } from '@tanstack/react-query';
import {
  EmulateHeaders,
  gqlClient,
  graphql,
  queryClient,
  Sa_SchoolActivityInput,
  useAcademicNamespace,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
// import { assessmentsKeys } from './keys';

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
  const { activeAcademicNamespace } = useAcademicNamespace();

  return useMutation({
    mutationFn: (input: Sa_SchoolActivityInput) =>
      gqlClient.request(saveSchoolActivies, { input }),
    onSuccess: () => {
      // queryClient.invalidateQueries(assessmentsKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
