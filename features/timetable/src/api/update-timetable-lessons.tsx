import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  TtEditLessonPeriodInstanceWrapper,
} from '@tyro/api';

import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { timetableKeys } from './keys';

const updateTimetableLessons = graphql(/* GraphQL */ `
  mutation tt_editLessonInstance($input: TTEditLessonPeriodInstanceWrapper!) {
    tt_editLessonInstance(input: $input) {
      id {
        lessonIdx
        lessonInstanceIdx
        timetableGroupId
      }
    }
  }
`);

export function useUpdateTimetableLessons() {
  const { t } = useTranslation(['common', 'settings']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: TtEditLessonPeriodInstanceWrapper) =>
      gqlClient.request(updateTimetableLessons, {
        input,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(timetableKeys.all);
      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
