import { useMutation } from '@tanstack/react-query';
import {
  ArchiveStudentContactInput,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

const deleteContacts = graphql(/* GraphQL */ `
  mutation core_archiveStudentContacts($input: ArchiveStudentContactInput!) {
    core_archiveStudentContacts(input: $input) {
      success
    }
  }
`);

export function useDeleteContacts() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: ArchiveStudentContactInput) =>
      gqlClient.request(deleteContacts, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.deleteSuccess'));
      queryClient.invalidateQueries(peopleKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
