import {
  gqlClient,
  graphql,
  queryClient,
  Tt_UpdateTimetableGroupInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { useMutation } from '@tanstack/react-query';
import { timetableKeys } from '../keys';

const ttUpsertSubjectGroup = graphql(/* GraphQL */ `
  mutation tt_updateTimetableGroup($input: Tt_UpsertSubjectGroup!) {
    tt_upsertSubjectGroup(input: $input) {
      success
    }
  }
`);

export function useTtUpsertSubjectGroup() {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: Tt_UpsertSubjectGroup) =>
      gqlClient.request(ttUpsertSubjectGroup, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(timetableKeys.all);
      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
