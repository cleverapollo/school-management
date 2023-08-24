import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Tt_RemoveLessonInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { timetableKeys } from '../keys';

const deleteIndividualLesson = graphql(/* GraphQL */ `
  mutation tt_removeLesson($input: [Tt_RemoveLessonInput!]) {
    tt_removeLesson(input: $input) {
      success
    }
  }
`);

export function useDeleteIndividualLesson() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Tt_RemoveLessonInput[]) =>
      gqlClient.request(deleteIndividualLesson, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.deleteSuccess'));
      queryClient.invalidateQueries(timetableKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
