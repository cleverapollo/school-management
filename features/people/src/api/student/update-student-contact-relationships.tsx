import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Core_UpdateStudentContactRelationshipInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

const updateStudentContactRelationships = graphql(/* GraphQL */ `
  mutation core_updateStudentContactRelationships(
    $input: [Core_UpdateStudentContactRelationshipInput]
  ) {
    core_updateStudentContactRelationships(input: $input) {
      success
    }
  }
`);

export function useUpdateStudentContactRelationships() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: Core_UpdateStudentContactRelationshipInput[]) =>
      gqlClient.request(updateStudentContactRelationships, {
        input: input.map(({ allowedToContact, ...inputData }) => ({
          ...inputData,
          allowedToContact,
          ...(allowedToContact === false && {
            includeInSms: false,
            includeInTmail: false,
          }),
        })),
      }),
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
