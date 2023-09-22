import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { reportsKeys } from './keys';

const reportsList = graphql(/* GraphQL */ `
  query reporting_reports {
    reporting_reports {
      id
      name
    }
  }
`);

const reportsListQuery = () => ({
  queryKey: reportsKeys.all,
  queryFn: async () => gqlClient.request(reportsList, {}),
});

export function getReportsList() {
  return queryClient.fetchQuery(reportsListQuery());
}

export function useReportsList() {
  return useQuery({
    ...reportsListQuery(),
    select: ({ reporting_reports }) => reporting_reports,
  });
}

export type ReturnTypeFromUseReportsList = UseQueryReturnType<
  typeof useReportsList
>[number];
