import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  UserAccessFilter,
} from '@tyro/api';
import { userAccessKeys } from './keys';

const userAccess = graphql(/* GraphQL */ `
  query users_userAccess($filter: UserAccessFilter) {
    users_userAccess(filter: $filter) {
      personPartyId
      personalInfo {
        firstName
        lastName
        primaryEmail {
          email
        }
      }
      contactStudents {
        firstName
        lastName
      }
      webLastLogin
      mobileLastLogin
      status
      invitedOn
      yearGroup {
        shortName
      }
      yearGroupContacts {
        shortName
      }
      mobileAppVersion
    }
  }
`);

const userAccessQuery = (filter: UserAccessFilter) => ({
  queryKey: userAccessKeys.userAccess(filter),
  queryFn: async () => gqlClient.request(userAccess, { filter }),
});

export function getUserAccess(filter: UserAccessFilter) {
  return queryClient.fetchQuery(userAccessQuery(filter));
}

export function useUserAccess(filter: UserAccessFilter) {
  return useQuery({
    ...userAccessQuery(filter),
    select: ({ users_userAccess }) => users_userAccess ?? [],
  });
}

export type ReturnTypeFromUseUserAccess = UseQueryReturnType<
  typeof useUserAccess
>[number];
