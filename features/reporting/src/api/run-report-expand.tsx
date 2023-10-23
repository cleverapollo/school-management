import {
  gqlClient,
  graphql,
  Reporting_ReportFilterExpand,
  UseQueryReturnType,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { reportsKeys } from './keys';

const reportExpand = graphql(/* GraphQL */ `
  query reporting_runReportExpand($filter: Reporting_ReportFilterExpand) {
    reporting_runReportExpand(filter: $filter) {
      id
      fields {
        id
        label
        visibleByDefault
      }
      data
    }
  }
`);

const reportExpandQuery = (filter: Reporting_ReportFilterExpand) => ({
  queryKey: reportsKeys.reportExpand(filter),
  staleTime: 0,
  queryFn: async () => gqlClient.request(reportExpand, { filter }),
});

export function useRunReportExpand(filter: Reporting_ReportFilterExpand) {
  return useQuery({
    ...reportExpandQuery(filter),
    enabled: !!filter.id,
    select: ({ reporting_runReportExpand }) => reporting_runReportExpand,
  });
}

export type ReturnTypeFromUseRunReportExpand = UseQueryReturnType<
  typeof useRunReportExpand
>;
