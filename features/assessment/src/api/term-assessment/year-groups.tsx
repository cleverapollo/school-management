import { useQuery } from '@tanstack/react-query';

import { gqlClient, graphql, queryClient, YearGroupFilter } from '@tyro/api';

const yearGroups = graphql(/* GraphQL */ `
  query years($filter: YearGroupFilter) {
    years(filter: $filter) {
      yearGroupId
      name
    }
  }
`);

export const yearGroupsKey = {
  list: ['termAssessment', 'yearGroups'] as const,
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
    select: ({ years }) => {
      if (!Array.isArray(years)) return [];

      return years;
    },
  });
}
