import { useMutation } from '@tanstack/react-query';

import {
  UpsertStudentContactInput,
  gqlClient,
  queryClient,
  graphql,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleContactsKeys } from './keys';

const upsertContact = graphql(/* GraphQL */ `
  mutation core_upsertStudentContact($input: UpsertStudentContactInput!) {
    core_upsertStudentContact(input: $input) {
      partyId
    }
  }
`);

export function useUpsertContact() {
  const { toast } = useToast();
  const { t } = useTranslation(['people']);

  return useMutation({
    mutationKey: peopleContactsKeys.upsertContact(),
    mutationFn: async (input: UpsertStudentContactInput) =>
      gqlClient.request(upsertContact, { input }),
    onSuccess: (_, contact) => {
      // @ts-expect-error
      if (contact.id) {
        toast(t('people:successfullyUpdatedContact'));
      } else {
        toast(t('people:successfullyCreatedContact'));
      }
      queryClient.invalidateQueries(peopleContactsKeys.all);
    },
    onError: (_, contact) => {
      // @ts-expect-error
      if (contact.id) {
        toast(t('people:updatedContactUnsuccessful'), {
          variant: 'error',
        });
      } else {
        toast(t('people:createdContactUnsuccessful'), {
          variant: 'error',
        });
      }
    },
  });
}
