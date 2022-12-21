import { useQuery } from '@tanstack/react-query';
import {gqlClient, graphql, Room} from '@tyro/api';
import {useLoaderData} from "react-router";
import {loader} from "mini-css-extract-plugin";

const coreRooms = graphql(/* GraphQL */ `
  query core_rooms{
    core_rooms{
        roomId
        name
        capacity
    }
  }
`);
export function useCoreRooms() {
  return useQuery({
    queryKey: ['coreRooms'],
    queryFn: async () =>
      gqlClient.request(coreRooms),
    select: ({ core_rooms }) => {
      return core_rooms
    }
  });
}
