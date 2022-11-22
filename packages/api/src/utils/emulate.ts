export enum EmulateHeaders {
  TENANT = 'X-TENANT-ID',
  PARTY_ID = 'X-PARTY-ID',
}

export const addEmulationHeaders = (
  tenant: number | undefined,
  partyId: number | undefined
) => {
  localStorage.setItem(EmulateHeaders.TENANT, String(tenant));
  localStorage.setItem(EmulateHeaders.PARTY_ID, String(partyId));
};

export const removeEmulationHeaders = () => {
  localStorage.removeItem(EmulateHeaders.TENANT);
  localStorage.removeItem(EmulateHeaders.PARTY_ID);
};

export const checkIsUserEmulated = () =>
  !!localStorage.getItem('X-TENANT-ID') && !!localStorage.getItem('X-PARTY-ID');
