import { useMutation } from '@tanstack/react-query';

import { UpsertStaffInput, gqlClient, queryClient, graphql } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleStaffKeys } from './keys';

const upsertStaff = graphql(/* GraphQL */ `
  mutation core_upsertStaff($input: [UpsertStaffInput]) {
    core_upsertStaff(input: $input) {
      partyId
    }
  }
`);

export function useCreateStaff() {
  const { toast } = useToast();
  const { t } = useTranslation(['people']);

  return useMutation({
    mutationKey: peopleStaffKeys.upsertStaff(),
    mutationFn: async (input: [UpsertStaffInput]) =>
      gqlClient.request(upsertStaff, { input }),
    onSuccess: () => {
      toast(t('people:successfullyCreatedStaff'));
      queryClient.invalidateQueries(peopleStaffKeys.all);
    },
    onError: () => {
      toast(t('people:createdStaffUnsuccessful'), {
        variant: 'error',
      });
    },
  });
}
