import {
  Reporting_ReportFilter,
  Reporting_ReportFilterExpand,
} from '@tyro/api';

export const reportsKeys = {
  all: ['reports'] as const,
  report: (filter: Reporting_ReportFilter) =>
    [...reportsKeys.all, 'report', filter] as const,
  reportExpand: (filter: Reporting_ReportFilterExpand) =>
    [...reportsKeys.all, 'reportExpand', filter] as const,
};
