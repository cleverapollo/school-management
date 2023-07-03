import { useQuery } from '@tanstack/react-query';
import { graphql } from '../gql';
import { gqlClient } from '../clients';
import { queryClient } from '../query-client';
import { YearGroupFilter } from '../gql/graphql';
import { UseQueryReturnType } from '../@types';
import { coreApiKeys } from './keys';

const yearGroups = graphql(/* GraphQL */ `
  query years($filter: YearGroupFilter) {
    catalogue_years(filter: $filter) {
      yearGroupId
      name
    }
  }
`);

const yearGroupsQuery = (filter: YearGroupFilter) => ({
  queryKey: coreApiKeys.yearGroups.all(),
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

export type ReturnTypeFromUseYearGroups = UseQueryReturnType<
  typeof useYearGroups
>[number];
