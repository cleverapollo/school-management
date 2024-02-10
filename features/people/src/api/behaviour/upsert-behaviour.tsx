import { useMutation } from '@tanstack/react-query';

import { gqlClient, queryClient, graphql, Notes_UpsertNote } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

const upsertNote = graphql(/* GraphQL */ `
  mutation notes_upsertNotes($input: [Notes_UpsertNote]) {
    notes_upsertNotes(input: $input) {
      id
    }
  }
`);

export function useUpsertStudentBehaviour() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Notes_UpsertNote[]) =>
      gqlClient.request(upsertNote, { input }),
    onSuccess: async (_, [note]) => {
      await queryClient.invalidateQueries(peopleKeys.students.all());

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
