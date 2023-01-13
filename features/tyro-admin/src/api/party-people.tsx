import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';

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

export function useAdminPartyPeopleByTenantId(tenantId: number) {
  return useQuery({
    queryKey: ['admin', 'party-people', tenantId],
    queryFn: async () =>
      gqlClient.request(adminPartyPeopleByTenantId, { tenant: tenantId }),
    select: ({ admin__party_people }) =>
      admin__party_people?.map((person) => ({
        ...person,
        tenant: tenantId,
        name: `${person?.firstName ?? ''} ${person?.lastName ?? ''}`,
      })),
  });
}
