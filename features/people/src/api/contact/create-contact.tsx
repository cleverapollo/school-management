import { useMutation } from '@tanstack/react-query';

import {
  CreateStudentContactInput,
  gqlClient,
  queryClient,
  graphql,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleContactKeys } from './keys';

const createContact = graphql(/* GraphQL */ `
  mutation core_createStudentContact($input: CreateStudentContactInput!) {
    core_createStudentContact(input: $input) {
      partyId
    }
  }
`);

export function useCreateContact() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationKey: peopleContactKeys.createContact(),
    mutationFn: async (input: CreateStudentContactInput) =>
      gqlClient.request(createContact, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.createSuccess'));
      queryClient.invalidateQueries(peopleContactKeys.all);
    },
  });
}
