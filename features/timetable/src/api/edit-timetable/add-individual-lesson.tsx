import { useMutation } from '@tanstack/react-query';

import { gqlClient, queryClient, graphql, Tt_AddLessonInput } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { timetableKeys } from '../keys';

const addIndividualLesson = /* GraphQL */ `
  mutation tt_addLesson($input: Tt_AddLessonInput) {
    tt_addLesson(input: $input) {
      success
    }
  }
`;
export function useAddIndividualLesson() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Tt_AddLessonInput) =>
      gqlClient.request(addIndividualLesson, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.createSuccess'));
      queryClient.invalidateQueries(timetableKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
