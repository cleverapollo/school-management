import { useQuery } from '@tanstack/react-query';
import { UseQueryReturnType, gqlClient, graphql, queryClient } from '@tyro/api';
import { peopleStaffKeys } from './keys';

const staffPosts = graphql(/* GraphQL */ `
  query catalogue_staffPosts {
    catalogue_staffPosts {
      id
      name
    }
  }
`);

const staffPostsQuery = () => ({
  queryKey: peopleStaffKeys.staffPosts(),
  queryFn: () => gqlClient.request(staffPosts),
});

export function getStaffPosts() {
  return queryClient.fetchQuery(staffPostsQuery());
}

export function useStaffPosts() {
  return useQuery({
    ...staffPostsQuery(),
    select: ({ catalogue_staffPosts }) => catalogue_staffPosts,
  });
}

export type StaffPostsOption = UseQueryReturnType<typeof useStaffPosts>[number];
