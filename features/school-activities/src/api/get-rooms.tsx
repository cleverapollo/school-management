import { useQuery } from '@tanstack/react-query';

import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
import { activitiesKeys } from './keys';

const roomsList = graphql(/* GraphQL */ `
  query roomsList {
    core_rooms {
      roomId
      name
      capacity
      description
    }
  }
`);

const roomsListQuery = () => ({
  queryKey: activitiesKeys.rooms(),
  queryFn: async () => gqlClient.request(roomsList),
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
