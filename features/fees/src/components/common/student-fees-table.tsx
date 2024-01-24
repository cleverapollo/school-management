import { TFunction, useFormatNumber, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  TablePersonAvatar,
  useDisclosure,
  usePreferredNameLayout,
} from '@tyro/core';
import { useMemo, useState } from 'react';
import { Box, Button, Fade, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import {
  FeeStatus,
  StudentFeeFilter,
  usePermissions,
  UsePermissionsReturn,
} from '@tyro/api';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  ReturnTypeFromUseStudentFees,
  useStudentFees,
} from '../../api/student-fees';
import { PayFeesModal } from './pay-fees-modal';
import { FeeStatusChip } from './fee-status-chip';
import { ReturnTypeFromUseFeeDebtors } from '../../api/debtors';
import { getDiscountName } from '../../utils/get-discount-name';

dayjs.extend(LocalizedFormat);

interface StudentFeeTableProps {
  filter: StudentFeeFilter;
}

const getColumnDefs = (
  t: TFunction<('fees' | 'common')[], undefined, ('fees' | 'common')[]>,
  displayName: ReturnTypeDisplayName,
  formatCurrency: ReturnType<typeof useFormatNumber>['formatCurrency'],
  permissions: UsePermissionsReturn
): GridOptions<ReturnTypeFromUseStudentFees>['columnDefs'] => [
  {
    field: 'person',
    headerName: t('fees:for'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentFees>) => {
      if (!data) return null;
      const { person } = data;

      return <TablePersonAvatar person={person} />;
    },
  },
  {
    field: 'feeName',
    headerName: t('fees:feeName'),
  },
  {
    field: 'dueDate',
    headerName: t('fees:dueBy'),
    valueFormatter: ({ data }) =>
      data?.dueDate ? dayjs(data.dueDate).format('LL') : '-',
    sort: 'asc',
  },
  {
    field: 'amount',
    headerName: t('fees:amount'),
    valueGetter: ({ data }) => formatCurrency(data?.amount ?? 0),
    type: 'numericColumn',
  },
  {
    field: 'amountDue',
    headerName: t('fees:due'),
    valueGetter: ({ data }) => formatCurrency(data?.amountDue ?? 0),
    type: 'numericColumn',
  },
  {
    field: 'amountPaid',
    headerName: t('fees:amountPaid'),
    valueGetter: ({ data }) => formatCurrency(data?.amountPaid ?? 0),
    type: 'numericColumn',
  },
  {
    field: 'discounts',
    headerName: t('fees:discounts'),
    hide: !permissions.isStaffUser,
    suppressColumnsToolPanel: !permissions.isStaffUser,
    valueGetter: ({ data }) =>
      data && Array.isArray(data?.discounts) && data.discounts.length > 0
        ? data?.discounts?.map(getDiscountName).join(', ')
        : '-',
  },
  {
    field: 'feeStatus',
    headerName: t('common:status'),
    valueGetter: ({ data }) =>
      data?.feeStatus ? t(`fees:status.${data.feeStatus}`) : '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFeeDebtors>) =>
      data?.feeStatus ? <FeeStatusChip status={data.feeStatus} /> : '-',
    sort: 'asc',
    sortIndex: 0,
  },
];

export function StudentFeesTable({ filter }: StudentFeeTableProps) {
  const { t } = useTranslation(['common', 'fees', 'navigation']);
  const { displayName } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();
  const [selectedStudentFeeIds, setSelectedStudentFeeIds] = useState<
    Set<string>
  >(new Set());
  const permissions = usePermissions();

  const {
    isOpen: isPayFeesModalOpen,
    onOpen: onOpenPayFeesModal,
    onClose: onClosePayFeesModal,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  const { data: studentFees } = useStudentFees(filter);

  const selectedStudentFees = useMemo(
    () =>
      studentFees?.filter((studentFee) =>
        selectedStudentFeeIds.has(JSON.stringify(studentFee.id.feeId))
      ) ?? [],
    [studentFees, selectedStudentFeeIds]
  );

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName, formatCurrency, permissions),
    [t, displayName, formatCurrency, permissions]
  );

  const someFeesHaveBeenPaid = selectedStudentFees.some(
    ({ feeStatus }) => feeStatus === FeeStatus.Complete
  );

  return (
    <>
      <Table
        rowData={studentFees || []}
        columnDefs={columnDefs}
        rowSelection="multiple"
        getRowId={({ data }) => JSON.stringify(data?.id)}
        rightAdornment={
          <Fade in={selectedStudentFees.length > 0} unmountOnExit>
            <Tooltip
              title={
                someFeesHaveBeenPaid
                  ? t('fees:cantPayAsSomeSelectedFeesHaveBeenFullyPaid')
                  : undefined
              }
            >
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onOpenPayFeesModal}
                  disabled={someFeesHaveBeenPaid}
                >
                  {t('fees:pay')}
                </Button>
              </Box>
            </Tooltip>
          </Fade>
        }
        onRowSelection={(selectedRows) => {
          setSelectedStudentFeeIds(
            new Set(selectedRows.map((row) => JSON.stringify(row.id.feeId)))
          );
        }}
      />
      <PayFeesModal
        open={isPayFeesModalOpen}
        onClose={onClosePayFeesModal}
        feesToPay={selectedStudentFees}
      />
    </>
  );
}
