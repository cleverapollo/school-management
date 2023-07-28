import {
  gqlClient,
  graphql,
  queryClient,
  Swm_InsertSubstitution,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { useMutation } from '@tanstack/react-query';
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
    onSuccess: () => {
      queryClient.invalidateQueries(substitutionKeys.all);
      toast(t('substitution:coverAppliedSuccessfully'));
    },
    onError: () => {
      toast(t('substitution:applyingCoverFailed'), { variant: 'error' });
    },
  });
}
