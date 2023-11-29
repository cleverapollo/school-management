import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  TableAvatar,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useFormatNumber, useTranslation } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useUser } from '@tyro/api';
import {
  ReturnTypeFromUseStudentFees,
  useStudentFees,
} from '../api/student-fees';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<('fees' | 'common')[], undefined, ('fees' | 'common')[]>,
  displayName: ReturnTypeDisplayName,
  formatCurrency: ReturnType<typeof useFormatNumber>['formatCurrency']
): GridOptions<ReturnTypeFromUseStudentFees>['columnDefs'] => [
  {
    field: 'person',
    headerName: t('fees:for'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentFees>) => {
      if (!data) return null;
      const { person } = data;

      return (
        <TableAvatar name={displayName(person)} avatarUrl={person?.avatarUrl} />
      );
    },
  },
  {
    field: 'dueDate',
    headerName: t('fees:dueDate'),
  },
  {
    field: 'feeDescription',
    headerName: t('common:description'),
  },
  {
    field: 'amount',
    headerName: t('fees:amount'),
    valueGetter: ({ data }) =>
      data?.amount ? formatCurrency(data.amount) : null,
    type: 'numericColumn',
  },
  {
    field: 'amountPaid',
    headerName: t('fees:amountPaid'),
    valueGetter: ({ data }) =>
      data?.amountPaid ? formatCurrency(data.amountPaid) : null,
    type: 'numericColumn',
  },
];

export default function ContactDashboard() {
  const { t } = useTranslation(['common', 'fees', 'navigation']);
  const { activeProfile } = useUser();
  const { displayName } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();

  const { data: studentFees } = useStudentFees({
    contactPartyId: activeProfile?.partyId,
  });

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName, formatCurrency),
    [t, displayName, formatCurrency]
  );

  return (
    <PageContainer title={t('navigation:management.fees')}>
      <PageHeading
        title={t('navigation:management.fees')}
        titleProps={{ variant: 'h3' }}
      />
      <Table
        rowData={studentFees || []}
        columnDefs={columnDefs}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
      />
    </PageContainer>
  );
}
