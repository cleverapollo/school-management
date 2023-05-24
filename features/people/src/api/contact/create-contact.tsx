import { useMutation } from '@tanstack/react-query';

import {
  CreateStudentContactInput,
  gqlClient,
  queryClient,
  graphql,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleContactsKeys } from './keys';

const createContact = graphql(/* GraphQL */ `
  mutation core_createStudentContact($input: CreateStudentContactInput!) {
    core_createStudentContact(input: $input) {
      partyId
    }
  }
`);

export function useCreateContact() {
  const { toast } = useToast();
  const { t } = useTranslation(['people']);

  return useMutation({
    mutationKey: peopleContactsKeys.createContact(),
    mutationFn: async (input: CreateStudentContactInput) =>
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