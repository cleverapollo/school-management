import { HEADERS } from "../constants";

export const addEmulationHeaders = (tenant: number | undefined, partyId: number | undefined) => {
  localStorage.setItem(HEADERS.TENANT, String(tenant));
  localStorage.setItem(HEADERS.PARTY_ID, String(partyId));
}

export const removeEmulationHeaders = () => {
  localStorage.removeItem(HEADERS.TENANT);
  localStorage.removeItem(HEADERS.PARTY_ID);
}

export const checkIsUserEmulated = () => !!localStorage.getItem('X-TENANT-ID') && !!localStorage.getItem('X-PARTY-ID');
