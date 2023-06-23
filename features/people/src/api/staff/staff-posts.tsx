import { useQuery } from '@tanstack/react-query';
import { UseQueryReturnType, gqlClient, graphql } from '@tyro/api';
import { peopleKeys } from '../keys';

const staffPosts = graphql(/* GraphQL */ `
  query catalogue_staffPosts {
    catalogue_staffPosts {
      id
      name
    }
  }
`);

const staffPostsQuery = () => ({
  queryKey: peopleKeys.staff.staffPosts(),
  queryFn: () => gqlClient.request(staffPosts),
});

export function useStaffPosts() {
  return useQuery({
    ...staffPostsQuery(),
    select: ({ catalogue_staffPosts }) => catalogue_staffPosts,
  });
}

export type StaffPostsOption = UseQueryReturnType<typeof useStaffPosts>[number];
