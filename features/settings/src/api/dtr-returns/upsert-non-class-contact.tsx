import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  SaveNonClassContactHoursInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { dtrReturnsKeys } from './keys';

const upsertNonClassContact = graphql(/* GraphQL */ `
  mutation eire_upsertNonClassContactHours(
    $input: SaveNonClassContactHoursInput
  ) {
    eire_upsertNonClassContactHours(input: $input) {
      success
    }
  }
`);

export function useUpsertNonClassContact() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: SaveNonClassContactHoursInput) =>
      gqlClient.request(upsertNonClassContact, { input }),
    onSuccess: async (_, nonClassContact) => {
      await queryClient.invalidateQueries(
        dtrReturnsKeys.nonClassContacts({
          staffPartyId: 12345,
          academicNameSpaceId: 1,
        })
      );

      toast(
        nonClassContact
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
