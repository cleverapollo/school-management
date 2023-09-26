import {
  Reporting_ReportFilter,
  Reporting_ReportFilterExpand,
} from '@tyro/api';

export type InnerReportFilter = {
  topReportId: Reporting_ReportFilter['reportId'];
  filter: Reporting_ReportFilter;
};

export const reportsKeys = {
  all: ['reports'] as const,
  report: (filter: InnerReportFilter) =>
    [...reportsKeys.all, 'report', filter] as const,
  reportExpand: (filter: Reporting_ReportFilterExpand) =>
    [...reportsKeys.all, 'reportExpand', filter] as const,
};
