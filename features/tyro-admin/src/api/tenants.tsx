import { useMutation, useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

const adminTenants = graphql(/* GraphQL */ `
  query admin__tenants {
    admin__tenants {
      tenant
      name
      imgUrl
    }
  }
`);

const adminResetTenantCache = graphql(/* GraphQL */ `
  mutation admin__resetTenantCache($input: Int) {
    admin__resetTenantCache(input: $input) {
      success
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

export function useEvictTenantLevelCache() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: number) =>
      gqlClient.request(adminResetTenantCache, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.updateSuccess'));
    },
  });
}

export type ReturnTypeFromUseEvictTenantLevelCache = ReturnType<
  typeof useEvictTenantLevelCache
>;
