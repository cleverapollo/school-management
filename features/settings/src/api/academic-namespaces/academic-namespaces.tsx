import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';

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
