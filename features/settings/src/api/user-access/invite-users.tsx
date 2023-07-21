import { useMutation } from '@tanstack/react-query';

import { gqlClient, graphql, InviteUser, queryClient } from '@tyro/api';

import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

import { userAccessKeys } from './keys';

const inviteUsers = graphql(/* GraphQL */ `
  mutation users_inviteUsers($input: [InviteUser]) {
    users_inviteUsers(input: $input) {
      userAccesses {
        personPartyId
        webLastLogin
        mobileLastLogin
        status
        invitationId
        invitingPersonPartyId
        invitedOn
      }
      validations
    }
  }
`);

export function useInviteUsers() {
  const { t } = useTranslation(['common', 'settings']);
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (input: InviteUser[]) =>
      gqlClient.request(inviteUsers, {
        input,
      }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.inviteSent'));
      queryClient.invalidateQueries(userAccessKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
      queryClient.invalidateQueries(userAccessKeys.all);
    },
  });
}
