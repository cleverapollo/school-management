import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  SaveNonClassContactHoursInput,
  NonClassContactHoursFilter,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

const upsertNonClassContact = graphql(/* GraphQL */ `
  mutation eire_upsertNonClassContactHours(
    $input: SaveNonClassContactHoursInput
  ) {
    eire_upsertNonClassContactHours(input: $input) {
      success
    }
  }
`);

export function useUpsertNonClassContact(filter: NonClassContactHoursFilter) {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: SaveNonClassContactHoursInput) =>
      gqlClient.request(upsertNonClassContact, { input }),
    onSuccess: async (_, nonClassContact) => {
      await queryClient.invalidateQueries(
        peopleKeys.staff.nonClassContacts(filter)
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
