import { useQuery } from '@tanstack/react-query';
import {
  PermissionGroupFilter,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { permissionsKeys } from './keys';

const permissionGroups = graphql(/* GraphQL */ `
  query composite_permissionGroups($filter: PermissionGroupFilter!) {
    composite_permissionGroups(filter: $filter) {
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
    select: ({ composite_permissionGroups }) =>
      (composite_permissionGroups ?? []).sort((a, b) =>
        a!.name.localeCompare(b!.name)
      ),
  });
}
