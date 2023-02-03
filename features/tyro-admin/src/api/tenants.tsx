import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';

const adminTenants = graphql(/* GraphQL */ `
  query admin__tenants {
    admin__tenants {
      tenant
      name
      imgUrl
    }
  }
`);

export const adminTenantsKeys = {
  all: ['admin', 'tenants'] as const,
};

const adminTenantsQuery = {
  queryKey: adminTenantsKeys.all,
  queryFn: async () => gqlClient.request(adminTenants),
};

export function getTenants() {
  return queryClient.fetchQuery(adminTenantsQuery);
}

export function useAdminTenants() {
  return useQuery({
    ...adminTenantsQuery,
    select: ({ admin__tenants }) =>
      admin__tenants?.map((tenant) => ({
        ...tenant,
        location: 'Dublin',
        type: 'IE Secondary',
        firstButton: '',
        secondButton: '',
        tech: '',
      })),
  });
}
