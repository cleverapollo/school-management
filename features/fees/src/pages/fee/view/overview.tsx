import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import {
  TFunction,
  useFormatNumber,
  useTranslation,
  ReturnTypeFromUseFormatNumber,
} from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  usePreferredNameLayout,
  getNumber,
  ReturnTypeDisplayName,
  ValueFormatterParams,
} from '@tyro/core';

import { StudentTableAvatar } from '@tyro/people';
import { getPersonProfileLink } from '@tyro/api';
import { FeeStatusChip } from '../../../components/common/fee-status-chip';
import {
  ReturnTypeFromUseFeeDebtors,
  useFeeDebtors,
} from '../../../api/debtors';

const getFeeOverviewColumns = (
  t: TFunction<('common' | 'fees')[], undefined, ('common' | 'fees')[]>,
  displayName: ReturnTypeDisplayName,
  formatCurrency: ReturnTypeFromUseFormatNumber['formatCurrency']
): GridOptions<ReturnTypeFromUseFeeDebtors>['columnDefs'] => [
  {
    field: 'person',
    headerName: t('common:name'),
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFeeDebtors, any>) =>
      data ? (
        <StudentTableAvatar
          person={data?.person}
          isPriorityStudent={false}
          hasSupportPlan={false}
          to={getPersonProfileLink(data?.person)}
        />
      ) : null,
    cellClass: 'cell-value-visible',
    sort: 'asc',
    lockVisible: true,
    filter: true,
  },
  {
    field: 'classGroup.name',
    headerName: t('common:class'),
    enableRowGroup: true,
    filter: true,
  },
  {
    field: 'amount',
    headerName: t('fees:amount'),
    valueFormatter: ({
      value,
    }: ValueFormatterParams<ReturnTypeFromUseFeeDebtors, number>) =>
      formatCurrency(value ?? 0),
  },
  {
    field: 'amountPaid',
    headerName: t('fees:paid'),
    valueFormatter: ({
      value,
    }: ValueFormatterParams<ReturnTypeFromUseFeeDebtors, number>) =>
      formatCurrency(value ?? 0),
  },
  {
    field: 'amountDue',
    headerName: t('fees:due'),
    valueFormatter: ({
      value,
    }: ValueFormatterParams<ReturnTypeFromUseFeeDebtors, number>) =>
      formatCurrency(value ?? 0),
  },
  {
    field: 'discounts',
    headerName: t('fees:discounts'),
    valueGetter: ({ data }) =>
      data && Array.isArray(data?.discounts) && data.discounts.length > 0
        ? data?.discounts?.map((d) => d?.name).join(', ')
        : '-',
  },
  {
    field: 'feeStatus',
    headerName: t('common:status'),
    valueGetter: ({ data }) =>
      data?.feeStatus ? t(`fees:status.${data?.feeStatus}`) : '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFeeDebtors, any>) =>
      data?.feeStatus ? <FeeStatusChip status={data?.feeStatus} /> : '-',
  },
];

export default function StudentProfileClassesPage() {
  const { id } = useParams();
  const feeId = getNumber(id);
  const { t } = useTranslation(['common', 'fees']);
  const { displayName } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();

  const { data: debtors } = useFeeDebtors({
    ids: [feeId ?? 0],
  });

  const columns = useMemo(
    () => getFeeOverviewColumns(t, displayName, formatCurrency),
    [t, displayName, formatCurrency]
  );

  return (
    <Table
      rowData={debtors ?? []}
      columnDefs={columns}
      getRowId={({ data }) => String(data?.id)}
    />
  );
}
