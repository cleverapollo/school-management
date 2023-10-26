import { useMutation } from '@tanstack/react-query';
import {
  gqlClient,
  queryClient,
  graphql,
  SaveCommentBankInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';

import { commentBanksKeys } from './keys';

const saveCommentBank = graphql(/* GraphQL */ `
  mutation assessment_saveCommentBank($input: [SaveCommentBankInput]) {
    assessment_saveCommentBank(input: $input) {
      id
      name
      description
      active
      comments {
        id
        comment
        active
      }
    }
  }
`);

export function useCreateCommentBank() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: [SaveCommentBankInput]) =>
      gqlClient.request(saveCommentBank, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(commentBanksKeys.all);
      toast(t('common:snackbarMessages.createSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
