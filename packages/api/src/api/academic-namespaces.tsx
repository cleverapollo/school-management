import { useQuery } from '@tanstack/react-query';
import { graphql } from '../gql';
import { gqlClient } from '../gql-client';
import { queryClient } from '../query-client';

const coreAcademicNamespaces = graphql(/* GraphQL */ `
  query core_academicNamespaces {
    core_academicNamespaces {
      academicNamespaceId
      type
      name
      year
      description
      isActiveDefaultNamespace
    }
  }
`);

export const coreAcademicNamespaceKeys = {
  all: ['coreAcademicNamespace'] as const,
};

const coreAcademicNamespaceQuery = {
  queryKey: coreAcademicNamespaceKeys.all,
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
