import { gqlClient, graphql, Notes_DeleteNotes, queryClient } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { useMutation } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

const deleteNote = graphql(/* GraphQL */ `
  mutation notes_deleteNote($input: Notes_DeleteNotes!) {
    notes_deleteNote(input: $input) {
      success
    }
  }
`);

export function useDeleteNote(studentId: number | undefined) {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: Notes_DeleteNotes) =>
      gqlClient.request(deleteNote, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        peopleKeys.students.notes({ partyIds: [studentId ?? 0] })
      );

      toast(t('common:snackbarMessages.deleteSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
