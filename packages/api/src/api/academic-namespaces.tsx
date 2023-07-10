import { useQuery } from '@tanstack/react-query';
import { UseQueryReturnType } from '../@types';
import { graphql } from '../gql';
import { gqlClient } from '../clients';
import { queryClient } from '../query-client';
import { coreApiKeys } from './keys';

export type ReturnTypeFromUseCoreAcademicNamespace = UseQueryReturnType<
  typeof useCoreAcademicNamespace
>[number];

const coreAcademicNamespaces = graphql(/* GraphQL */ `
  query core_academicNamespaces {
    core_academicNamespaces {
      academicNamespaceId
      type
      name
      year
      description
      isActiveDefaultNamespace
      startDate
      endDate
    }
  }
`);

const coreAcademicNamespaceQuery = {
  queryKey: coreApiKeys.academicNamespaces.all(),
  queryFn: async () => gqlClient.request(coreAcademicNamespaces),
};

export function getCoreAcademicNamespace() {
  return queryClient.fetchQuery(coreAcademicNamespaceQuery);
}

export function useCoreAcademicNamespace() {
  return useQuery({
    ...coreAcademicNamespaceQuery,
    select: ({ core_academicNamespaces }) => core_academicNamespaces,
  });
}
