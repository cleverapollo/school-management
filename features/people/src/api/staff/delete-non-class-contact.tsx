import { useMutation } from '@tanstack/react-query';

import {
  DeleteNonClassContactHoursInput,
  gqlClient,
  graphql,
  NonClassContactHoursFilter,
  queryClient,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

const deleteNonClassContact = graphql(/* GraphQL */ `
  mutation eire_deleteNonClassContactHours(
    $input: DeleteNonClassContactHoursInput!
  ) {
    eire_deleteNonClassContactHours(input: $input) {
      success
    }
  }
`);

export function useDeleteNonClassContact(filter: NonClassContactHoursFilter) {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: DeleteNonClassContactHoursInput) =>
      gqlClient.request(deleteNonClassContact, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        peopleKeys.staff.nonClassContacts(filter)
      );
      toast(t('common:snackbarMessages.deleteSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
