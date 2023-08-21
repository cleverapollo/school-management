import {
  gqlClient,
  graphql,
  queryClient,
  Swm_DeleteSubstitution,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { useMutation } from '@tanstack/react-query';
import { calendarKeys } from '@tyro/calendar';
import { substitutionKeys } from './keys';

const deleteCover = graphql(/* GraphQL */ `
  mutation swm_deleteSubstitutions($input: SWM_DeleteSubstitution!) {
    swm_deleteSubstitutions(input: $input) {
      success
    }
  }
`);

export function useDeleteCover() {
  const { t } = useTranslation(['substitution']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: Swm_DeleteSubstitution) =>
      gqlClient.request(deleteCover, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(substitutionKeys.all);
      queryClient.invalidateQueries(calendarKeys.all);
      toast(t('substitution:coverRemovedSuccessfully'));
    },
    onError: () => {
      toast(t('substitution:removingCoverFailed'), { variant: 'error' });
    },
  });
}
