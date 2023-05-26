import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  queryClient,
  graphql,
  SavePpodCredentials,
  SyncRequestsFilter,
  UseQueryReturnType,
  SyncRequest,
  SchoolInfo,
} from '@tyro/api';

// Query to retrieve sync requests
const syncRequests = graphql(/* GraphQL */ `
  query ppod_syncRequests($filter: SyncRequestsFilter!) {
    ppod_syncRequests(filter: $filter) {
      id
      syncRequestStatus
      requesterPartyId
      requester {
        partyId
        title
        titleId
        firstName
        lastName
        avatarUrl
        type
      }
      requestedOn
    }
  }
`);

// Query to sync PPOD
const syncFromPpod = graphql(/* GraphQL */ `
  query ppod_syncPPOD {
    ppod_syncPPOD {
      id
      syncRequestStatus
      requesterPartyId
      requester {
        partyId
        title
        titleId
        firstName
        lastName
        avatarUrl
        type
      }
      requestedOn
    }
  }
`);

// Login to PPOD
const savePpodCredentials = graphql(/* GraphQL */ `
  mutation ppod_savePPODCredentials($input: SavePPODCredentials!) {
    ppod_savePPODCredentials(input: $input) {
      username
      password
    }
  }
`);

// Query to check if PPOD credentials have previously been saved
const ppodCredentials = graphql(/* GraphQL */ `
  query ppod_PPODCredentials {
    ppod_PPODCredentials {
      username
      password
      lastSyncSuccessful
    }
  }
`);

// Query to retrieve school details
const schoolsInfo = graphql(/* GraphQL */ `
  query users_schoolInfo {
    users_schoolInfo {
      id
      rollNo
      name
      email
      website
      fax
      principal
      boardingFeeFiveDay
      boardingFeeSixOrSevenDay
      schoolGender
      parentAssociation
      studentCouncil
      boardOfManagement
      irishClassification
      coOperatingSchoolRollNo1
      coOperatingSchoolRollNo2
      octoberReturnsContact
      octoberReturnsPhoneNo
      octoberReturnsFaxNo
      octoberReturnsEmail
      phones {
        phone
      }
      addresses {
        address1
        address2
        address3
        address4
        county
        localAuthority
      }
      chairPeople {
        chairPersonId
        forename
        surname
        phoneNo
        startDate
        endDate
      }
      owners {
        ownerId
        forename
        surname
        addressLine1
        addressLine2
        addressLine3
        addressLine4
        startDate
        endDate
      }
      trustees {
        trusteeId
        forename
        surname
        addressLine1
        addressLine2
        addressLine3
        addressLine4
        startDate
        endDate
      }
    }
  }
`);

// KEYS
export const ppodSyncKeys = {
  all: ['ppodSync'] as const,
  syncRequests: (filter: SyncRequestsFilter) =>
    [...ppodSyncKeys.all, filter] as const,
  syncFromPpod: () => [...ppodSyncKeys.all, 'syncFromPpod'] as const,
  ppodCredentialsStatus: () => [...ppodSyncKeys.all] as const,
  schoolsInfo: () => [...ppodSyncKeys.all] as const,
  savePpodCredentials: () =>
    [...ppodSyncKeys.all, 'savePpodCredentials'] as const,
};

// QUERY => FETCH ALL DATA BELONG TO PREVIOUS SYNC REQUESTS
const syncRequestsQuery = (filter: SyncRequestsFilter) => ({
  queryKey: ppodSyncKeys.syncRequests(filter),
  queryFn: async () => gqlClient.request(syncRequests, { filter }),
});

export function getSyncRequests(filter: SyncRequestsFilter) {
  return queryClient.fetchQuery(syncRequestsQuery(filter));
}

export function useSyncRequests(filter: SyncRequestsFilter) {
  return useQuery({
    ...syncRequestsQuery(filter),
    select: ({ ppod_syncRequests }) => {
      if (!Array.isArray(ppod_syncRequests)) return [];
      return ppod_syncRequests as [];
    },
  });
}

// MUTATION => SAVE PPOD credentials
export function useSavePpodCredentials() {
  return useMutation({
    mutationKey: ppodSyncKeys.savePpodCredentials(),
    mutationFn: (input: SavePpodCredentials) =>
      gqlClient.request(savePpodCredentials, { input }),
  });
}

// QUERY => SYNC DATA FROM PPOD
const syncFromPpodQuery = {
  queryKey: ppodSyncKeys.syncFromPpod(),
  queryFn: async () => gqlClient.request(syncFromPpod),
};

export function getSyncFromPpodQuery() {
  return queryClient.fetchQuery(syncFromPpodQuery);
}

export function useSyncFromPpodQuery() {
  const test = useQuery({
    ...syncFromPpodQuery,
    enabled: false,
  });
  console.log(test.data, 'TESTING');
  if (test.data) {
    console.log(test.data, 'TESTING');
  }
  return test;
}

// QUERY => CHECK IF PPOD CREDENTIALS HAVE PREVIOUSLY BEEN SAVED
const ppodCredentialsStatus = {
  queryKey: ppodSyncKeys.ppodCredentialsStatus(),
  queryFn: async () => gqlClient.request(ppodCredentials),
};

export function getPpodCredentialsStatus() {
  return queryClient.fetchQuery(ppodCredentialsStatus);
}

export function usePpodCredentialsStatus() {
  return useQuery({
    ...ppodCredentialsStatus,
    select: ({ ppod_PPODCredentials }) => {
      if (!ppod_PPODCredentials) return null;
      return ppod_PPODCredentials as {
        username: string;
        password: string;
        lastSyncSuccessful: boolean;
      };
    },
  });
}

// QUERY => FETCH SCHOOL DETAILS
const schoolsInfoQuery = {
  queryKey: ppodSyncKeys.schoolsInfo(),
  queryFn: async () => gqlClient.request(schoolsInfo),
};

export function getSchoolsInfo() {
  return queryClient.fetchQuery(schoolsInfoQuery);
}

export function useSchoolsInfo() {
  return useQuery({
    ...schoolsInfoQuery,
    select: ({ users_schoolInfo }) => users_schoolInfo as SchoolInfo,
  });
}

// Return type for useSyncRequests
export type ReturnTypeFromUseSyncRequests = UseQueryReturnType<
  typeof useSyncRequests
>[number];

export type ReturnTypeFromUsePpodCredentialsStatus = UseQueryReturnType<
  typeof usePpodCredentialsStatus
>;

export type ReturnTypeFromUseSyncFromPpodQuery = UseQueryReturnType<
  typeof useSyncFromPpodQuery
>;

export type ReturnTypeFromUseSchoolsInfo = UseQueryReturnType<
  typeof useSchoolsInfo
>;
