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

const createContact = graphql(/* GraphQL */ `
  mutation core_upsertStudentContact($input: UpsertStudentContactInput!) {
    core_upsertStudentContact(input: $input) {
      partyId
    }
  }
`);

export function useCreateContact() {
  const { toast } = useToast();
  const { t } = useTranslation(['people']);

  return useMutation({
    mutationKey: peopleContactsKeys.createContact(),
    mutationFn: async (input: UpsertStudentContactInput) =>
      gqlClient.request(createContact, { input }),
    onSuccess: () => {
      toast(t('people:successfullyCreatedContact'));
      queryClient.invalidateQueries(peopleContactsKeys.all);
    },
    onError: () => {
      toast(t('people:createdContactUnsuccessful'), {
        variant: 'error',
      });
    },
  });
}
