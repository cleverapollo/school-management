import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';

const coreRooms = graphql(/* GraphQL */ `
  query core_rooms {
    core_rooms {
      roomId
      name
      capacity
    }
  }
`);

export const roomsKeys = {
  all: ['coreRooms'] as const,
};

const coreRoomsQuery = {
  queryKey: roomsKeys.all,
  queryFn: async () => gqlClient.request(coreRooms),
};

export function getCoreRooms() {
  return queryClient.fetchQuery(coreRoomsQuery);
}

export function useCoreRooms() {
  return useQuery({
    ...coreRoomsQuery,
    select: ({ core_rooms }) => core_rooms,
  });
}
