import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Calendar_UpdateDays,
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

export function useUpdateCalendarDays() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Calendar_UpdateDays) =>
      gqlClient.request(updateCalendarDays, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(schoolCalendarKeys.all);
      toast(t('common:snackbarMessages.createSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
