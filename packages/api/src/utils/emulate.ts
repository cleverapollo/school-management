export enum EmulateHeaders {
  TENANT = 'X-TENANT-ID',
  PARTY_ID = 'X-PARTY-ID',
  ACADEMIC_NAMESPACE_ID = 'X-ACADEMIC-NAMESPACE-ID',
}

export const addEmulationHeaders = (
  tenant: number | undefined,
  partyId: number | undefined
) => {
  localStorage.setItem(EmulateHeaders.TENANT, String(tenant));
  localStorage.setItem(EmulateHeaders.PARTY_ID, String(partyId));
  localStorage.removeItem(EmulateHeaders.ACADEMIC_NAMESPACE_ID);
};

export const addViewSchoolHeaders = (tenant: number | undefined) => {
  localStorage.setItem(EmulateHeaders.TENANT, String(tenant));
  localStorage.removeItem(EmulateHeaders.PARTY_ID);
  localStorage.removeItem(EmulateHeaders.ACADEMIC_NAMESPACE_ID);
};

export const removeEmulationHeaders = () => {
  localStorage.removeItem(EmulateHeaders.TENANT);
  localStorage.removeItem(EmulateHeaders.PARTY_ID);
  localStorage.removeItem(EmulateHeaders.ACADEMIC_NAMESPACE_ID);
};

export const checkEmulationMode = () => {
  if (localStorage.getItem(EmulateHeaders.TENANT)) {
    if (localStorage.getItem(EmulateHeaders.PARTY_ID)) {
      return EmulationMode.User;
    }
    return EmulationMode.Tenant;
  }
  return EmulationMode.None;
};

export enum EmulationMode {
  None,
  User,
  Tenant,
}
