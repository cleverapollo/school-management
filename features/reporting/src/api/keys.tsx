import {
  Reporting_ReportFilter,
  Reporting_ReportFilterExpand,
  AwolFilter,
} from '@tyro/api';

export type InnerReportFilter = {
  topReportId: Reporting_ReportFilter['reportId'];
  filter: Reporting_ReportFilter;
};

export const reportsKeys = {
  all: ['reports'] as const,
  reportInfo: (filter: InnerReportFilter) =>
    [...reportsKeys.all, 'reportInfo', filter] as const,
  report: (filter: InnerReportFilter) =>
    [...reportsKeys.all, 'report', filter] as const,
  reportExpand: (filter: Reporting_ReportFilterExpand) =>
    [...reportsKeys.all, 'reportExpand', filter] as const,
  awolReport: (filter: AwolFilter) =>
    [...reportsKeys.all, 'awolReport', filter] as const,
};
