import {
  gqlClient,
  graphql,
  queryClient,
  Swm_InsertSubstitution,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { useMutation } from '@tanstack/react-query';
import { calendarKeys } from '@tyro/calendar';
import { substitutionKeys } from './keys';

const applyCover = graphql(/* GraphQL */ `
  mutation swm_applySubstitutions($input: SWM_InsertSubstitution!) {
    swm_applySubstitutions(input: $input) {
      success
    }
  }
`);

export function useApplyCover() {
  const { t } = useTranslation(['substitution']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: Swm_InsertSubstitution) =>
      gqlClient.request(applyCover, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(substitutionKeys.all);
      queryClient.invalidateQueries(calendarKeys.all);
      toast(t('substitution:coverAppliedSuccessfully'));
    },
    onError: () => {
      toast(t('substitution:applyingCoverFailed'), { variant: 'error' });
    },
  });
}
