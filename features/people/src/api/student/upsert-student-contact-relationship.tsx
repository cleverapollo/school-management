import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Core_UpsertStudentContactRelationshipInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

const upsertStudentContactRelationships = graphql(/* GraphQL */ `
  mutation core_upsertStudentContactRelationships(
    $input: [Core_UpsertStudentContactRelationshipInput]
  ) {
    core_upsertStudentContactRelationships(input: $input) {
      success
    }
  }
`);

export function useUpsertStudentContactRelationships() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationKey: peopleKeys.students.upsertStudentContactRelationships(),
    mutationFn: async (input: Core_UpsertStudentContactRelationshipInput[]) =>
      gqlClient.request(upsertStudentContactRelationships, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(peopleKeys.all);
      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}
