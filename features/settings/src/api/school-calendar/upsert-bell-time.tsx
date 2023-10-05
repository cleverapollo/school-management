import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Calendar_CreateBellTimeInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { calendarKeys } from '@tyro/calendar';
import { schoolCalendarKeys } from './keys';

const upsertBellTime = graphql(/* GraphQL */ `
  mutation calendar_upsertBellTime($input: Calendar_CreateBellTimeInput) {
    calendar_upsertBellTime(input: $input) {
      success
    }
  }
`);

export function useUpsertBellTime() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationKey: schoolCalendarKeys.upsertBellTime,
    mutationFn: async (input: Calendar_CreateBellTimeInput) =>
      gqlClient.request(upsertBellTime, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(calendarKeys.all);
      toast(t('common:snackbarMessages.createSuccess'));
    },
  });
}
