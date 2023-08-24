import { useMutation } from '@tanstack/react-query';

import {
  Notes_UpsertBehaviourTagInput,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { peopleKeys } from '../keys';

const upsertBehaviourTags = graphql(/* GraphQL */ `
  mutation notes_upsertBehaviourTags($input: [Notes_UpsertBehaviourTagInput]) {
    notes_upsertBehaviourTags(input: $input) {
      id
    }
  }
`);

export function useUpsertBehaviourTags() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Notes_UpsertBehaviourTagInput[]) =>
      gqlClient.request(upsertBehaviourTags, { input }),
    onSuccess: async (_, [note]) => {
      await queryClient.invalidateQueries(peopleKeys.notes.behaviourTags());

      toast(
        note
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
