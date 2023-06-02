import { SyncRequestsFilter } from '@tyro/api';

export const ppodSyncKeys = {
  all: ['ppodSync'] as const,
  syncRequests: (filter: SyncRequestsFilter) =>
    [...ppodSyncKeys.all, filter] as const,
  syncFromPpod: () => [...ppodSyncKeys.all, 'syncFromPpod'] as const,
  ppodCredentialsStatus: () =>
    [...ppodSyncKeys.all, 'credentialStatus'] as const,
  schoolsInfo: () => [...ppodSyncKeys.all, 'schoolsInfo'] as const,
  savePpodCredentials: () =>
    [...ppodSyncKeys.all, 'savePpodCredentials'] as const,
};
