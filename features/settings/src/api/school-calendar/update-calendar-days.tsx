import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Calendar_UpdateDays,
  CalendarDayInfoFilter,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { schoolCalendarKeys } from './keys';

const updateCalendarDays = graphql(/* GraphQL */ `
  mutation updateClaendarDays($input: Calendar_UpdateDays) {
    calendar_updateCalendarDays(input: $input) {
      success
    }
  }
`);

export function useUpdateCalendarDays(filter: CalendarDayInfoFilter) {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationKey: schoolCalendarKeys.updateCalendarDays(),
    mutationFn: async (input: Calendar_UpdateDays) =>
      gqlClient.request(updateCalendarDays, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(schoolCalendarKeys.dayInfo(filter));
      toast(t('common:snackbarMessages.createSuccess'));
    },
  });
}
