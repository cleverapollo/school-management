import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  Notes_BehaviourCategoryInput,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { peopleKeys } from '../keys';

const upsertBehaviourCategory = graphql(/* GraphQL */ `
  mutation notes_upsertBehaviourCategory($input: Notes_BehaviourCategoryInput) {
    notes_upsertBehaviourCategory(input: $input) {
      success
    }
  }
`);

export function useUpsertBehaviourCategory() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Notes_BehaviourCategoryInput) =>
      gqlClient.request(upsertBehaviourCategory, { input }),
    onSuccess: async (_, category) => {
      await queryClient.invalidateQueries(
        peopleKeys.notes.behaviourCategories()
      );

      toast(
        category
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
