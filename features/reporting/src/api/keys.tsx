import { Reporting_ReportFilter } from '@tyro/api';

export const reportsKeys = {
  all: ['reports'] as const,
  report: (filter: Reporting_ReportFilter) =>
    [...reportsKeys.all, filter] as const,
};
