import {
  PartyGroupType,
  PartyPersonType,
  Reporting_Pinned,
  Reporting_ReportCellType,
  Reporting_TableFieldType,
  Reporting_TableReportField,
} from '@tyro/api';
import { ExtendedReportData } from '../components/types';
import { Report } from '../utils/get-report-url';

export const mockTableReport: {
  fields: Reporting_TableReportField[];
  data: ExtendedReportData[];
} = {
  fields: [
    {
      id: 'fee_name',
      label: 'Fee Name',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      pinned: Reporting_Pinned.Left,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Raw,
      type: Reporting_TableFieldType.String,
    },
    {
      id: 'full_name',
      label: 'Student',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Person,
      type: Reporting_TableFieldType.String,
      meta: {
        showAvatar: true,
        enableLink: true,
      },
    },
    {
      id: 'staff_name',
      label: 'Staff',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Person,
      type: Reporting_TableFieldType.String,
      meta: {
        showAvatar: false,
        enableLink: true,
      },
    },
    {
      id: 'class_group_name',
      label: 'Class',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.PartyGroup,
      type: Reporting_TableFieldType.String,
      meta: {
        showAvatar: true,
        enableLink: true,
      },
    },
    {
      id: 'date',
      label: 'Payment Date',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Date,
      type: Reporting_TableFieldType.String,
      meta: {
        dateFormat: 'L',
      },
    },
    {
      id: 'receipt_id',
      label: 'Receipt No',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Raw,
      type: Reporting_TableFieldType.String,
    },
    {
      id: 'amount',
      label: 'Amount',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Currency,
      type: Reporting_TableFieldType.String,
    },
    {
      id: 'service_fees_amount',
      label: 'Service Fees Amount',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Currency,
      type: Reporting_TableFieldType.String,
    },
    {
      id: 'total',
      label: 'Total',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Currency,
      type: Reporting_TableFieldType.String,
    },
    {
      id: 'payee_name',
      label: 'Payee Name',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Chip,
      type: Reporting_TableFieldType.String,
    },
    {
      id: 'payment_method',
      label: 'Payment Type',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Chip,
      type: Reporting_TableFieldType.String,
    },
    {
      id: 'stripe_id',
      label: 'Stripe ID',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Raw,
      type: Reporting_TableFieldType.String,
      meta: {
        enableLink: true,
      },
    },
    {
      id: 'absorb_fees',
      label: 'Absorb Fees',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Boolean,
      type: Reporting_TableFieldType.String,
    },
    {
      id: 'card_type',
      label: 'Card Type',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Raw,
      type: Reporting_TableFieldType.String,
    },
    {
      id: 'phone_number',
      label: 'Phone number',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.PhoneNumber,
      type: Reporting_TableFieldType.String,
    },
    {
      id: 'payout_date',
      label: 'Payout Date',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: Reporting_ReportCellType.Date,
      type: Reporting_TableFieldType.String,
      meta: {
        dateFormat: 'L',
      },
    },
  ],
  data: [
    {
      date: {
        value: '2024-01-15T12:05:53.39',
      },
      amount: {
        value: 5,
      },
      service_fees_amount: {
        value: 0.19,
      },
      receipt_id: {
        value: 130,
      },
      payee_party_id: {
        value: 108163,
      },
      class_group_id: {
        value: 110811,
      },
      class_group_name: {
        value: {
          type: PartyGroupType.SubjectGroup,
          name: '3G',
          partyId: 112505,
        },
        link: {
          profileTab: 'attendance',
          queryParams: {
            eventStartTime: '2024-01-30T08:55:00',
          },
        },
      },
      card_type: {
        value: 'Visa',
      },
      absorb_fees: {
        value: true,
      },
      fee_name: {
        value: 'Woodwork supplies',
      },
      total: {
        value: 5.19,
      },
      full_name: {
        value: {
          type: PartyPersonType.Student,
          firstName: 'Winford',
          lastName: 'Rippin',
          partyId: 106680,
        },
        link: {
          profileTab: 'attendance',
        },
      },
      staff_name: {
        value: {
          type: PartyPersonType.Staff,
          firstName: 'Staff name a',
          lastName: 'LastName A',
        },
        link: {
          report: Report.OCTOBER_RETURNS,
          reportTab: 'school-stats',
        },
      },
      payout_date: {
        value: '2024-01-31T12:05:53.39',
      },
      fee_id: {
        value: 41,
      },
      payee_name: {
        value: [
          {
            name: 'Cletus Jast',
          },
          {
            name: 'Other',
          },
        ],
      },
      id: {
        value: 130,
      },
      tenant: {
        value: 11,
      },
      stripe_id: {
        value: 'pi_3Oc7J6DT811pK8VE0xZdKc45',
        link: {
          externalUrl: 'https://google.com',
        },
      },
      payment_method: {
        value: {
          name: 'Card',
          color: 'green',
        },
      },
      phone_number: {
        value: {
          countryCode: '353',
          number: '894461288',
        },
      },
    },
  ],
};
