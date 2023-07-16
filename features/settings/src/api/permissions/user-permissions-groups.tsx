import { useQuery } from '@tanstack/react-query';
import {
  PermissionGroupFilter,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { permissionsKeys } from './keys';

const permissionGroups = graphql(/* GraphQL */ `
  query users_permissionGroups($filter: PermissionGroupFilter!) {
    users_permissionGroups(filter: $filter) {
      id
      name
      description
      memberType
      memberPartyIds
      custom
      permissionSets {
        id
        toggle
        permissionType
        feature
      }
    }
  }
`);

const permissionGroupsQuery = (filter: PermissionGroupFilter) => ({
  queryKey: permissionsKeys.permissionGroups(filter),
  queryFn: () => gqlClient.request(permissionGroups, { filter }),
});

export function getPermissionGroups(filter: PermissionGroupFilter) {
  return queryClient.fetchQuery(permissionGroupsQuery(filter));
}

export function usePermissionGroups(filter: PermissionGroupFilter) {
  return useQuery({
    ...permissionGroupsQuery(filter),
    select: ({ users_permissionGroups }) => users_permissionGroups ?? [],
  });
}
