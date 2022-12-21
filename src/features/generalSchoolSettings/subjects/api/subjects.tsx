import { useQuery } from '@tanstack/react-query';
import {gqlClient, graphql, Room} from '@tyro/api';
import {useLoaderData} from "react-router";
import {loader} from "mini-css-extract-plugin";

const catalogue_subjects = graphql(/* GraphQL */ `
  query catalogue_subjects{
      catalogue_subjects{
        id
        name
        description
        shortCode
        nationalCode
        subjectSource
    }
  }
`);
export function useCatalogueSubjects() {
  return useQuery({
    queryKey: ['catalogue_subjects'],
    queryFn: async () =>
      gqlClient.request(catalogue_subjects),
    select: ({ core_rooms }) => {
      return core_rooms
    }
  });
}

