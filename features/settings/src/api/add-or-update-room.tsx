import { useMutation } from '@tanstack/react-query';

import { gqlClient, queryClient, graphql, UpsertRoomInput } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { roomsKeys } from './rooms';

const createRooms = graphql(/* GraphQL */ `
  mutation core_upsertRooms($input: [UpsertRoomInput]) {
    core_upsertRooms(input: $input) {
      roomId
    }
  }
`);

export function useCreateOrUpdateRoom() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationKey: roomsKeys.createOrUpdateRoom(),
    mutationFn: async (input: UpsertRoomInput) =>
      gqlClient.request(createRooms, { input: [input] }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: (_, variables) => {
      if (variables?.roomId) {
        toast(t('common:snackbarMessages.updateSuccess'));
      } else {
        toast(t('common:snackbarMessages.createSuccess'));
      }
      queryClient.invalidateQueries(roomsKeys.all);
    },
  });
}
