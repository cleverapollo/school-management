import { useMutation, useQuery } from '@tanstack/react-query';

import {
  AssessmentFilter,
  EmulateHeaders,
  gqlClient,
  graphql,
  PublishAssessmentInput,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

const roomsList = graphql(/* GraphQL */ `
  query roomsList {
    core_rooms {
      roomId
      name
      capacity
      description
      pools
      includeInTimetable
      externalSystemId
      location
      disabled
    }
  }
`);

const roomsListQuery = () => ({
  queryFn: () => gqlClient.request(roomsList),
});

export function getRoomsList() {
  return queryClient.fetchQuery(roomsListQuery());
}

export function useRoomsList() {
  return useQuery({
    ...roomsListQuery(),
    select: ({ core_rooms }) => core_rooms,
  });
}

export type RoomList = UseQueryReturnType<typeof useRoomsList>[number];
