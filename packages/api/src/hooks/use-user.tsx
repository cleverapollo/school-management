import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { gqlClient } from '../gql-client';

import { graphql } from '../gql/gql';
import { queryClient } from '../query-client';
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
          userType
        }
        permissionIds
      }
    }
  }
`);

const userQuery = {
  queryKey: ['user', 'details'],
  queryFn: async () => gqlClient.request(myAuthDetailsDocument),
};

export function getUser() {
  return queryClient.fetchQuery(userQuery);
}

export function useUser() {
  const { isTokenInitialized, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    ...queryProps
  } = useQuery({
    ...userQuery,
    enabled: isTokenInitialized,
    select: ({ myAuthDetails }) => ({
      ...myAuthDetails,
      profiles: myAuthDetails?.profiles?.map((profile) => ({
        ...profile,
        nickName: profile?.nickName ?? myAuthDetails?.name ?? null,
      })),
    }),
    onError: () => {
      navigate('/auth/unauthorized', { replace: true });
    },
  });

  return useMemo(
    () => ({
      user,
      activeProfile: user?.profiles?.find(
        (profile) => profile?.id === user.activeProfileId
      ),
      isLoading,
      isInitialized: isTokenInitialized && Boolean(user),
      isAuthenticated,
      ...queryProps,
    }),
    [user, isLoading, isTokenInitialized, isAuthenticated, queryProps]
  );
}
