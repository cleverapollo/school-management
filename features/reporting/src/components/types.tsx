import { GridOptions } from '@tyro/core';
import { Reporting_Colour, Reporting_TableReportField } from '@tyro/api';
import { ChipProps } from '@mui/material';

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
    customLink?: {
      reportId?: string;
      partyId?: number;
      tab?: string;
      filters?: Record<string, any>;
      searchParams?: Record<string, any>;
      path?: string;
    };
  };
};

export type ReportColumnDef = NonNullable<
  GridOptions<ExtendedReportData>['columnDefs']
>[number];
