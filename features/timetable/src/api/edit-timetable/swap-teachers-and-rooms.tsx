import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, TtSwapsInput } from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { timetableKeys } from '../keys';

const swapTeachersAndRooms = graphql(/* GraphQL */ `
  mutation tt_swap($input: TTSwapsInput!) {
    tt_swap(input: $input) {
      success
    }
  }
`);

export function useSwapTeachersAndRooms() {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: TtSwapsInput) =>
      gqlClient.request(swapTeachersAndRooms, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(timetableKeys.all);
      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
