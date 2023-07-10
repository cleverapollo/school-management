import {
  gqlClient,
  graphql,
  queryClient,
  TtPublishTimetableInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { useMutation } from '@tanstack/react-query';
import { timetableKeys } from '../keys';

const ttPublishTimetable = graphql(/* GraphQL */ `
  mutation tt_publish($input: TTPublishTimetableInput!) {
    tt_publish(input: $input) {
      success
    }
  }
`);

export function useTtPublishTimetable() {
  const { t } = useTranslation(['timetable']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: TtPublishTimetableInput) =>
      gqlClient.request(ttPublishTimetable, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(timetableKeys.all);
      toast(t('timetable:timetablePublishedSuccessfully'));
    },
    onError: () => {
      toast(t('timetable:timetableFailedToPublish'), { variant: 'error' });
    },
  });
}
