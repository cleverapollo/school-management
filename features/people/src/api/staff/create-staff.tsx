import { useMutation } from '@tanstack/react-query';

import { CreateStaffInput, gqlClient, queryClient, graphql } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleStaffKeys } from './keys';

const createStaff = graphql(/* GraphQL */ `
  mutation core_createStaff($input: [CreateStaffInput]) {
    core_createStaff(input: $input) {
      partyId
    }
  }
`);

export function useCreateStaff() {
  const { toast } = useToast();
  const { t } = useTranslation(['people']);

  return useMutation({
    mutationKey: peopleStaffKeys.createStaff(),
    mutationFn: async (input: [CreateStaffInput]) =>
      gqlClient.request(createStaff, { input }),
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
