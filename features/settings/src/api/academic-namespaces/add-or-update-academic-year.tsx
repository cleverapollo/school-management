import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  coreAcademicNamespaceKeys,
  SaveAcademicNamespaceInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';

const createAcademicNamespace = graphql(/* GraphQL */ `
  mutation core_upsertAcademicNamespace($input: SaveAcademicNamespaceInput) {
    core_upsertAcademicNamespace(input: $input) {
      academicNamespaceId
    }
  }
`);

export function useCreateOrUpdateAcademicYear() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationKey: ['coreAcademicNamespace', 'core_upsertAcademicNamespace'],
    mutationFn: async (input: SaveAcademicNamespaceInput) =>
      gqlClient.request(createAcademicNamespace, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: (_, variables) => {
      if (variables?.id) {
        toast(t('common:snackbarMessages.updateSuccess'));
      } else {
        toast(t('common:snackbarMessages.createSuccess'));
      }
      queryClient.invalidateQueries(coreAcademicNamespaceKeys.all);
    },
  });
}
