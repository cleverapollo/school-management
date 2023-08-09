import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
import { peopleKeys } from '../../keys';

const personalTitles = graphql(/* GraphQL */ `
  query catalogue_personalTitles {
    catalogue_personalTitles {
      id
      name
    }
  }
`);

const personalTitlesQuery = {
  queryKey: peopleKeys.students.personalTitlesList(),
  queryFn: async () => gqlClient.request(personalTitles),
};

export function getPersonalTitlesQuery() {
  return queryClient.fetchQuery(personalTitlesQuery);
}

export function usePersonalTitlesQuery() {
  return useQuery({
    ...personalTitlesQuery,
    select: ({ catalogue_personalTitles }) => catalogue_personalTitles,
  });
}

export type ReturnTypeFromUsePersonalTitles = UseQueryReturnType<
  typeof usePersonalTitlesQuery
>;
