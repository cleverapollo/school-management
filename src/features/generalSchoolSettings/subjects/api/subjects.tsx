import { useQuery } from '@tanstack/react-query';
import {gqlClient, graphql, Room} from '@tyro/api';
import {useLoaderData} from "react-router";
import {loader} from "mini-css-extract-plugin";

const catalogueSubjects = graphql(/* GraphQL */ `
  query catalogueSubjects{
      catalogue_subjects{
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
    queryFn: async () =>
      gqlClient.request(catalogueSubjects),
    select: ({ catalogue_subjects }) => {
      return catalogue_subjects
    }
  });
}

