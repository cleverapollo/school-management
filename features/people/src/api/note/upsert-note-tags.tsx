import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Notes_UpsertNotesTagInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

const upsertNoteTags = graphql(/* GraphQL */ `
  mutation notes_upsertNotesTags($input: [Notes_UpsertNotesTagInput]) {
    notes_upsertNotesTags(input: $input) {
      id
    }
  }
`);

export function useUpsertNoteTags() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Notes_UpsertNotesTagInput[]) =>
      gqlClient.request(upsertNoteTags, { input }),
    onSuccess: async (_, [note]) => {
      await queryClient.invalidateQueries(peopleKeys.notes.noteTags());

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
