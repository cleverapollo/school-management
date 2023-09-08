import { useMutation } from '@tanstack/react-query';

import {
  DeleteNonClassContactHoursInput,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { dtrReturnsKeys } from './keys';

const deleteNonClassContact = graphql(/* GraphQL */ `
  mutation eire_deleteNonClassContactHours(
    $input: DeleteNonClassContactHoursInput!
  ) {
    eire_deleteNonClassContactHours(input: $input) {
      success
    }
  }
`);

export function useDeleteNonClassContact() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: DeleteNonClassContactHoursInput) =>
      gqlClient.request(deleteNonClassContact, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.deleteSuccess'));
      queryClient.invalidateQueries(
        dtrReturnsKeys.nonClassContacts({
          staffPartyId: 12345,
          academicNameSpaceId: 1,
        })
      );
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
