import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { gqlClient } from '../clients';

import { graphql } from '../gql/gql';
import { GlobalUser, MyAuthDetailsQuery } from '../gql/graphql';
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
        avatarUrl
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
        partyId
      }
    }
  }
`);

export const userKeys = {
  all: ['user'] as const,
  details: () => [...userKeys.all, 'details'] as const,
};

const userQuery = {
  queryKey: userKeys.details(),
  queryFn: async () => gqlClient.request(myAuthDetailsDocument),
  staleTime: 1000 * 60 * 10,
};

export async function getUser() {
  const { myAuthDetails: user } = await queryClient.fetchQuery(userQuery);

  return {
    user,
    activeProfile: findActiveProfile(user),
  };
}

export function findActiveProfile(user: MyAuthDetailsQuery['myAuthDetails']) {
  return user?.profiles?.find(
    (profile) => profile?.id === user.activeProfileId
  );
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
      navigate('/unauthorized', { replace: true });
    },
  });

  return useMemo(
    () => ({
      user,
      activeProfile: findActiveProfile(user as GlobalUser),
      isLoading,
      isInitialized: isTokenInitialized && Boolean(user),
      isAuthenticated,
      ...queryProps,
    }),
    [user, isLoading, isTokenInitialized, isAuthenticated, queryProps]
  );
}
