import { useQuery } from '@tanstack/react-query';
import { graphql } from '../gql';
import { gqlClient } from '../gql-client';
import { queryClient } from '../query-client';
import { YearGroupFilter } from '../gql/graphql';

const yearGroups = graphql(/* GraphQL */ `
  query years($filter: YearGroupFilter) {
    catalogue_years(filter: $filter) {
      yearGroupId
      name
    }
  }
`);

export const yearGroupsKey = {
  list: ['yearGroups'] as const,
};

const yearGroupsQuery = (filter: YearGroupFilter) => ({
  queryKey: yearGroupsKey.list,
  queryFn: () => gqlClient.request(yearGroups, { filter }),
});

export function getYearGroups(filter: YearGroupFilter) {
  return queryClient.fetchQuery(yearGroupsQuery(filter));
}

export function useYearGroups(filter: YearGroupFilter) {
  return useQuery({
    ...yearGroupsQuery(filter),
    select: ({ catalogue_years }) => {
      if (!Array.isArray(catalogue_years)) return [];

      return catalogue_years;
    },
  });
}