import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';

const adminTenants = graphql(/* GraphQL */ `
  query admin__tenants {
    admin__tenants {
      tenant
      name
      imgUrl
    }
  }
`);

export function useAdminTenants() {
  return useQuery({
    queryKey: ['admin', 'tenants'],
    queryFn: async () => gqlClient.request(adminTenants),
    select: ({ admin__tenants }) => {
      return admin__tenants?.map(tenant => ({
        ...tenant,
        location: 'Dublin',
        type: 'IE Secondary',
        firstButton: '',
        secondButton: '',
        tech: '',
      }))
    }
  });
}
