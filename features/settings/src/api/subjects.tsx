import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';

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
export function useCatalogueSubjects() {
  return useQuery({
    queryKey: ['catalogue_subjects'],
    queryFn: async () => gqlClient.request(catalogueSubjects),
    select: ({ catalogue_subjects }) => catalogue_subjects,
  });
}
