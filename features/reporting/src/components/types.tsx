import { GridOptions } from '@tyro/core';
import { Reporting_Colour, Reporting_TableReportField } from '@tyro/api';
import { ChipProps } from '@mui/material';
import { Report, ReportTabs } from '../utils/get-report-url';

export enum ReportCellType {
  Raw = 'raw',
  Person = 'person',
  PartyGroup = 'party-group',
  Date = 'date',
  Currency = 'currency',
  Boolean = 'boolean',
  PhoneNumber = 'phone-number',
  Chip = 'chip',
}

export type ReportChipValue = {
  name: string;
  color?: ChipProps['color'];
};

export type ExtendedTableReportField = Omit<
  Reporting_TableReportField,
  'type'
> & {
  cellType: ReportCellType;
  meta?: {
    chipSize?: 'small' | 'medium';
    chipVariant?: 'outlined' | 'soft' | 'filled';
    currency?: string;
    dateFormat?: string;
    showAvatar?: boolean;
    avatarSize?: number;
    enableLink?: boolean;
  };
};

export type ExtendedReportData = {
  [key: ExtendedTableReportField['id']]: {
    // BE can send it as any FE will cast it
    // ex: string | number | boolean | Person | Person[] | PartyGroup | PartyGroup[] | PhoneNumber | ChipProps | ChipProps[];
    value: any | any[];
    meta?: Record<string, any>;
    colour?: Reporting_Colour;
    link?: {
      report?: Report;
      reportFilters?: Record<string, any>;
      reportTab?: keyof ReportTabs[keyof ReportTabs];
      profileTab?: string;
      searchParams?: Record<string, any>;
      externalUrl?: string;
    };
  };
};

export type ReportColumnDef = NonNullable<
  GridOptions<ExtendedReportData>['columnDefs']
>[number];
