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
    onError: (error) => {
      toast(t('common:snackbarMessages.errorFailed'));
      console.error(error);
    },
    onSuccess: () => {
      toast(t('common:snackbarMessages.createSuccess'));
      queryClient.invalidateQueries(roomsKeys.all);
    },
  });
}
