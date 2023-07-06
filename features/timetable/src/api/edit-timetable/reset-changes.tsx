import { gqlClient, graphql, queryClient, Tt_Reset } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { useMutation } from '@tanstack/react-query';
import { timetableKeys } from '../keys';

const ttResetChanges = graphql(/* GraphQL */ `
  mutation tt_reset($input: TT_Reset!) {
    tt_reset(input: $input) {
      success
    }
  }
`);

export function useTtResetChanges() {
  const { t } = useTranslation(['timetable']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: Tt_Reset) =>
      gqlClient.request(ttResetChanges, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(timetableKeys.all);
      toast(t('timetable:successfullyRevertedTimetableChanges'));
    },
    onError: () => {
      toast(t('timetable:failedToRevertTimetableChanges'), {
        variant: 'error',
      });
    },
  });
}
