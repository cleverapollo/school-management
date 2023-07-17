import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  PermissionSetFilter,
  queryClient,
} from '@tyro/api';
import { permissionsKeys } from './keys';

const permissionSets = graphql(/* GraphQL */ `
  query users_permissionSets($filter: PermissionSetFilter!) {
    users_permissionSets(filter: $filter) {
      id
      name
      description
      permissionType
      toggle
      feature
    }
  }
`);

const permissionSetsQuery = (filter: PermissionSetFilter) => ({
  queryKey: permissionsKeys.permissionSets(filter),
  queryFn: () => gqlClient.request(permissionSets, { filter }),
});

export function getPermissionSets(filter: PermissionSetFilter) {
  return queryClient.fetchQuery(permissionSetsQuery(filter));
}

export function usePermissionSets(filter: PermissionSetFilter) {
  return useQuery({
    ...permissionSetsQuery(filter),
    enabled: !!filter,
    select: ({ users_permissionSets }) =>
      Array.isArray(users_permissionSets)
        ? users_permissionSets.flatMap((permission) =>
            permission ? [permission] : []
          )
        : [],
  });
}
