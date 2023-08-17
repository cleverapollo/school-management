import { useMutation } from '@tanstack/react-query';

import { UpsertStaffInput, gqlClient, queryClient, graphql } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

const upsertStaff = graphql(/* GraphQL */ `
  mutation core_upsertStaff($input: [UpsertStaffInput]) {
    core_upsertStaff(input: $input) {
      partyId
    }
  }
`);

export function useUpsertStaff() {
  const { toast } = useToast();
  const { t } = useTranslation(['people']);

  return useMutation({
    mutationFn: async (input: [UpsertStaffInput]) =>
      gqlClient.request(upsertStaff, { input }),
    onSuccess: async (_, [staff]) => {
      await queryClient.invalidateQueries(peopleKeys.staff.all());

      toast(
        staff.id
          ? t('people:successfullyUpdatedStaff')
          : t('people:successfullyCreatedStaff')
      );
    },
    onError: (_, [staff]) => {
      toast(
        staff.id
          ? t('people:updatedStaffUnsuccessful')
          : t('people:createdStaffUnsuccessful'),
        {
          variant: 'error',
        }
      );
    },
  });
}
