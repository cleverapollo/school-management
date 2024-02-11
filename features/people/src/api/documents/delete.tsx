import {
  graphql,
  queryClient,
  DeleteFileTransferInput,
  gqlClient,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { useMutation } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

const deleteDocument = graphql(/* GraphQL */ `
  mutation delete_file_transfer($input: DeleteFileTransferInput!) {
    delete_file_transfer(input: $input) {
      success
    }
  }
`);

export function useDeleteDocuments(
  feature: DeleteFileTransferInput['feature']
) {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (ids: number[]) =>
      gqlClient.request(deleteDocument, {
        input: {
          feature,
          ids,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(peopleKeys.students.allDocuments());

      toast(t('common:snackbarMessages.deleteSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
