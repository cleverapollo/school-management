import { gqlClient, graphql, queryClient, Tt_ResetLessons } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { useMutation } from '@tanstack/react-query';
import { timetableKeys } from '../keys';

const ttResetLessonsChanges = graphql(/* GraphQL */ `
  mutation tt_resetLessons($input: TT_ResetLessons!) {
    tt_resetLessons(input: $input) {
      success
    }
  }
`);

export function useTtResetLessonsChanges() {
  const { t } = useTranslation(['timetable']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: Tt_ResetLessons) =>
      gqlClient.request(ttResetLessonsChanges, { input }),
    onSuccess: (_data, input) => {
      const numberOfLessons = input.lessons.length;
      queryClient.invalidateQueries(timetableKeys.all);
      toast(
        t('timetable:successfullyRevertedChangesForLesson', {
          count: numberOfLessons,
        })
      );
    },
    onError: (_error, input) => {
      const numberOfLessons = input.lessons.length;
      toast(
        t('timetable:failedToRevertChangesForLesson', {
          count: numberOfLessons,
        }),
        { variant: 'error' }
      );
    },
  });
}
