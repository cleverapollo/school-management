import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { InnerReportFilter, reportsKeys } from './keys';

const reportInfo = graphql(/* GraphQL */ `
  query reporting_reportInfo($filter: Reporting_ReportFilter) {
    reporting_runReport(filter: $filter) {
      id
      info {
        name
        supportsExpandRow
      }
      innerReports {
        id
        name
      }
    }
  }
`);

const reportsRun = graphql(/* GraphQL */ `
  query reporting_runReport($filter: Reporting_ReportFilter) {
    reporting_runReport(filter: $filter) {
      id
      info {
        name
        supportsExpandRow
      }
      innerReports {
        id
        name
      }
      debug {
        sql
      }
      filters {
        id
        inputType
        label
        defaultValue
        required
        values {
          id
          value
        }
        minValue
        maxValue
      }
      fields {
        id
        label
        visibleByDefault
        checkExpandedRows
        hideMenu
        sortable
        maxWidth
        minWidth
        pinned
      }
      data
      tableDisplayOptions {
        gridOptions
        tableContainerSx
      }
    }
  }
`);

const reportsInfoQuery = ({ topReportId, filter }: InnerReportFilter) => ({
  queryKey: reportsKeys.reportInfo({ topReportId, filter }),
  queryFn: async () => gqlClient.request(reportInfo, { filter }),
});

export function getReportInfo(filter: InnerReportFilter) {
  return queryClient.fetchQuery(reportsInfoQuery(filter));
}

export function useReportInfo(filter: InnerReportFilter) {
  return useQuery({
    ...reportsInfoQuery(filter),
    select: ({ reporting_runReport }) => reporting_runReport,
  });
}

const runReportsQuery = ({ topReportId, filter }: InnerReportFilter) => ({
  queryKey: reportsKeys.report({ topReportId, filter }),
  staleTime: 0,
  queryFn: async () => gqlClient.request(reportsRun, { filter }),
});

export function getRunReports(filter: InnerReportFilter) {
  return queryClient.fetchQuery(runReportsQuery(filter));
}

export function useRunReports(filter: InnerReportFilter) {
  return useQuery({
    ...runReportsQuery(filter),
    select: ({ reporting_runReport }) => reporting_runReport,
  });
}

export type ReturnTypeFromUseRunReports = UseQueryReturnType<
  typeof useRunReports
>;
