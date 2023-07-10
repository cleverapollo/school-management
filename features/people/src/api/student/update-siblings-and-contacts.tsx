import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Core_LinkSiblingsAndContacts,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

const updateSiblingsAndContacts = graphql(/* GraphQL */ `
  mutation core_linkSiblingsAndContacts($input: Core_LinkSiblingsAndContacts!) {
    core_linkSiblingsAndContacts(input: $input) {
      success
    }
  }
`);

export function useUpdateSiblingsAndContacts() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: Core_LinkSiblingsAndContacts) =>
      gqlClient.request(updateSiblingsAndContacts, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(peopleKeys.all);
      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}
