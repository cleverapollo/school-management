import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';

const coreRooms = graphql(/* GraphQL */ `
  query core_rooms {
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

export const roomsKeys = {
  all: ['coreRooms'] as const,
  createOrUpdateRoom: () => [...roomsKeys.all, 'createOrUpdateRoom'] as const,
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

export type ReturnTypeFromUseCoreRooms = UseQueryReturnType<
  typeof useCoreRooms
>[number];
