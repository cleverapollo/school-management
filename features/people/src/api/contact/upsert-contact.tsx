import { useMutation } from '@tanstack/react-query';

import {
  UpsertStudentContactInput,
  gqlClient,
  queryClient,
  graphql,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

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
    mutationFn: async (input: UpsertStudentContactInput) =>
      gqlClient.request(upsertContact, { input }),
    onSuccess: async (_, contact) => {
      await queryClient.invalidateQueries(peopleKeys.contacts.all());

      toast(
        // @ts-expect-error
        contact.id
          ? t('people:successfullyUpdatedContact')
          : t('people:successfullyCreatedContact')
      );
    },
    onError: (_, contact) => {
      toast(
        // @ts-expect-error
        contact.id
          ? t('people:updatedContactUnsuccessful')
          : t('people:createdContactUnsuccessful'),
        {
          variant: 'error',
        }
      );
    },
  });
}
