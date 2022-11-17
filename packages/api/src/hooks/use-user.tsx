import { useQuery } from '@tanstack/react-query';
import { gqlClient } from '../gql-client';

import { graphql } from '../gql/gql';
import { useAuth } from '../stores';

const myAuthDetailsDocument = graphql(/* GraphQL */ `
  query myAuthDetails {
    myAuthDetails {
      id
      email
      name
      defaultProfileId
      activeProfileId
      profiles {
        id
        nickName
        tenant {
          tenant
          name
          imgUrl
        }
        profileType {
          name
          description
        }
        permissionIds
      }
    }
  }
`);

export function useUser() {
  const { isTokenInitialized } = useAuth();

  return useQuery({
    queryKey: ['user', 'details'],
    queryFn: async () => gqlClient.request(myAuthDetailsDocument),
    enabled: isTokenInitialized,
  });
}
