/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { displayName } from '../../../../src/utils/nameUtils';

const adminPartyPeopleByTenantId = graphql(/* GraphQL */ `
  query admin__party_people($tenant: Int!) {
    admin__party_people(tenant: $tenant) {
      partyId
      firstName
      lastName
      type
    }
  }
`);

export const adminPartyPeopleKeys = {
  all: (tenantId: number) => ['calendar', 'calendarEvents', tenantId] as const,
};

const adminPartyPeopleQuery = (tenantId: number) => ({
  queryKey: adminPartyPeopleKeys.all(tenantId),
  queryFn: async () =>
    gqlClient.request(adminPartyPeopleByTenantId, { tenant: tenantId }),
});

export function getAdminPartyPeople(tenantId: number | undefined) {
  return queryClient.fetchQuery(adminPartyPeopleQuery(tenantId ?? 0));
}

export function useAdminPartyPeopleByTenantId(tenantId: number) {
  return useQuery({
    ...adminPartyPeopleQuery(tenantId),
    select: ({ admin__party_people }) =>
      admin__party_people?.map((person) => ({
        ...person,
        tenant: tenantId,
        name: displayName(person ?? undefined),
      })),
  });
}
