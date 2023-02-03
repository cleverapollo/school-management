import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';

const catalogueSubjects = graphql(/* GraphQL */ `
  query catalogueSubjects {
    catalogue_subjects {
      id
      name
      description
      shortCode
      nationalCode
      subjectSource
      colour
      icon
    }
  }
`);

export const catalogueSubjectsKeys = {
  all: ['catalogue_subjects'] as const,
};

const catalogueSubjectsQuery = {
  queryKey: catalogueSubjectsKeys.all,
  queryFn: async () => gqlClient.request(catalogueSubjects),
};

export function getCatalogueSubjects() {
  return queryClient.fetchQuery(catalogueSubjectsQuery);
}

export function useCatalogueSubjects() {
  return useQuery({
    ...catalogueSubjectsQuery,
    select: ({ catalogue_subjects }) => catalogue_subjects,
  });
}
