import { PartyGroupType, PartyPersonType, Reporting_Pinned } from '@tyro/api';
import {
  ExtendedReportData,
  ExtendedTableReportField,
  ReportCellType,
} from '../components/types';

export const mockTableReport: {
  fields: ExtendedTableReportField[];
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
      cellType: ReportCellType.Raw,
    },
    {
      id: 'full_name',
      label: 'Student',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.Person,
      meta: {
        showAvatar: true,
      },
    },
    {
      id: 'staff_name',
      label: 'Staff',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.Person,
      meta: {
        showAvatar: false,
      },
    },
    {
      id: 'class_group_name',
      label: 'Class',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.PartyGroup,
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
      cellType: ReportCellType.Date,
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
      cellType: ReportCellType.Raw,
    },
    {
      id: 'amount',
      label: 'Amount',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.Currency,
    },
    {
      id: 'service_fees_amount',
      label: 'Service Fees Amount',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.Currency,
    },
    {
      id: 'total',
      label: 'Total',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.Currency,
    },
    {
      id: 'payee_name',
      label: 'Payee Name',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.Chip,
    },
    {
      id: 'payment_method',
      label: 'Payment Type',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.Chip,
    },
    {
      id: 'stripe_id',
      label: 'Stripe ID',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.Raw,
    },
    {
      id: 'absorb_fees',
      label: 'Absorb Fees',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.Boolean,
    },
    {
      id: 'card_type',
      label: 'Card Type',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.Raw,
    },
    {
      id: 'phone_number',
      label: 'Phone number',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.PhoneNumber,
    },
    {
      id: 'payout_date',
      label: 'Payout Date',
      visibleByDefault: true,
      hideMenu: false,
      sortable: true,
      checkExpandedRows: false,
      cellType: ReportCellType.Date,
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
          type: PartyGroupType.ClassGroup,
          name: '3G',
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
        },
      },
      staff_name: {
        value: {
          type: PartyPersonType.Staff,
          firstName: 'Staff name a',
          lastName: 'LastName A',
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
