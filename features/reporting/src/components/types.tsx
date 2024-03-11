import { GridOptions, RouterLinkProps } from '@tyro/core';
import {
  Reporting_Colour,
  Reporting_TableReportDataColumnLink,
  Reporting_TableReportField,
} from '@tyro/api';
import { ChipProps } from '@mui/material';
import { Report, ReportTabs } from '../utils/get-report-url';

export type ReportChipValue = {
  name: string;
  color?: ChipProps['color'];
};

export type ExtendedReportData = {
  [key: Reporting_TableReportField['id']]: {
    // BE can send it as any FE will cast it
    // ex: string | number | boolean | Person | Person[] | PartyGroup | PartyGroup[] | PhoneNumber | ChipProps | ChipProps[];
    value: any | any[];
    meta?: Record<string, any>;
    colour?: Reporting_Colour;
    link?: Reporting_TableReportDataColumnLink & {
      report?: Report;
      reportFilters?: Record<string, any>;
      reportTab?: keyof ReportTabs[keyof ReportTabs];
      queryParams?: Record<string, any>;
      target?: RouterLinkProps['target'];
    };
  };
};

export type ReportColumnDef = NonNullable<
  GridOptions<ExtendedReportData>['columnDefs']
>[number];
