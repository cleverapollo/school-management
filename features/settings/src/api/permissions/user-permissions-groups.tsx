import { useQuery } from '@tanstack/react-query';
import { PermissionGroupFilter, gqlClient, graphql } from '@tyro/api';
import { permissionsKeys } from './keys';

const permissionGroups = graphql(/* GraphQL */ `
  query users_permissionGroups($filter: PermissionGroupFilter!) {
    users_permissionGroups(filter: $filter) {
      id
      name
      description
      memberType
      memberPartyIds
    }
  }
`);

const permissionGroupsQuery = (filter: PermissionGroupFilter) => ({
  queryKey: permissionsKeys.permissionGroups(filter),
  queryFn: () => gqlClient.request(permissionGroups, { filter }),
});

// TODO: take this from the PermissionGroup schema when BE supports it
export enum PresetIconName {
  Student = 'STUDENT',
  Teacher = 'TEACHER',
  Admin = 'ADMIN',
  Contact = 'CONTACT',
}

export function usePermissionGroups(filter: PermissionGroupFilter) {
  return useQuery({
    ...permissionGroupsQuery(filter),
    select: ({ users_permissionGroups }) =>
      // Array.isArray(users_permissionGroups) ? users_permissionGroups : []
      // TODO: remove these line and uncomment above when BE sends presetIconName
      (Array.isArray(users_permissionGroups) ? users_permissionGroups : []).map(
        (a) => ({ ...a, presetIconName: undefined })
      ),
  });
}
