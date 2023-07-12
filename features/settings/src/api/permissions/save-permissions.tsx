import { useMutation } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  SavePermissionGroup,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { permissionsKeys } from './keys';

const savePermissionGroup = graphql(/* GraphQL */ `
  mutation savePermissionGroup($input: SavePermissionGroup) {
    users_savePermissionGroup(input: $input) {
      id
    }
  }
`);

export function useSavePermissionGroup() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: SavePermissionGroup) =>
      gqlClient.request(savePermissionGroup, { input }),
    onSuccess: async (_, permissionGroup) => {
      await queryClient.invalidateQueries(permissionsKeys.all);

      toast(
        permissionGroup.id
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}
