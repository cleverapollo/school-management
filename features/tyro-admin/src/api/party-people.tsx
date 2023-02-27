import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';

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
        name: `${person?.firstName ?? ''} ${person?.lastName ?? ''}`,
      })),
  });
}