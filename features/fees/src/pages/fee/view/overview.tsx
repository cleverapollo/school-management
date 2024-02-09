import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
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
  ActionMenu,
  useDisclosure,
  ConfirmDialog,
} from '@tyro/core';

import { StudentTableAvatar } from '@tyro/people';
import { BulkAction, getPersonProfileLink } from '@tyro/api';
import { Box, Fade } from '@mui/material';
import { DiscountIcon, RemoveDiscountIcon } from '@tyro/icons';
import { FeeStatusChip } from '../../../components/common/fee-status-chip';
import {
  ReturnTypeFromUseFeeDebtors,
  useFeeDebtors,
} from '../../../api/debtors';
import { BulkAddIndividualDiscountModal } from '../../../components/fees/form/bulk-add-individual-discount-modal';
import { ReturnTypeFromUseDiscounts } from '../../../api/discounts';
import { useBulkApplyDiscounts } from '../../../api/bulk-apply-discounts';
import { getDiscountName } from '../../../utils/get-discount-name';

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
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
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
    sort: 'asc',
    sortIndex: 1,
  },
  {
    field: 'discounts',
    headerName: t('fees:discounts'),
    valueGetter: ({ data }) =>
      data && Array.isArray(data?.discounts) && data.discounts.length > 0
        ? data?.discounts?.map(getDiscountName).join(', ')
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
    sort: 'desc',
    sortIndex: 0,
  },
];

export default function StudentProfileClassesPage() {
  const { id } = useParams();
  const feeId = getNumber(id);
  const { t } = useTranslation(['common', 'fees']);
  const { displayName } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();
  const [selectedDebtorIds, setSelectedDebtorsIds] = useState<Set<number>>(
    new Set()
  );
  const {
    isOpen: isAddBulkDiscountModalOpen,
    onOpen: onOpenAddBulkDiscountModal,
    onClose: onCloseAddBulkDiscountModal,
  } = useDisclosure();
  const {
    isOpen: isRemoveDiscountConfirmOpen,
    onOpen: onOpenDiscountConfirm,
    onClose: onCloseDiscountConfirm,
  } = useDisclosure();

  const { data: debtors } = useFeeDebtors({
    ids: [feeId ?? 0],
  });
  const { mutateAsync: bulkApplyDiscounts } = useBulkApplyDiscounts();

  const selectedDebtors = useMemo(
    () => debtors?.filter((debtor) => selectedDebtorIds.has(debtor.id)) ?? [],
    [debtors, selectedDebtorIds]
  );

  const handleSaveIndividualDiscount = async (
    discount: ReturnTypeFromUseDiscounts
  ) =>
    bulkApplyDiscounts(
      {
        feeId: feeId ?? 0,
        individualDiscounts: selectedDebtors.map((debtor) => ({
          action: BulkAction.Upsert,
          discountId: discount.id,
          studentPartyId: debtor.person.partyId,
        })),
      },
      {
        onSuccess: onCloseAddBulkDiscountModal,
      }
    );

  const removeDiscounts = () =>
    bulkApplyDiscounts(
      {
        feeId: feeId ?? 0,
        individualDiscounts: selectedDebtors
          .filter(({ discounts }) => discounts.length > 0)
          .map((debtor) => ({
            action: BulkAction.Remove,
            discountId: debtor.discounts[0].id,
            studentPartyId: debtor.person.partyId,
          })),
      },
      {
        onSuccess: onCloseDiscountConfirm,
      }
    );

  const columns = useMemo(
    () => getFeeOverviewColumns(t, displayName, formatCurrency),
    [t, displayName, formatCurrency]
  );

  const doSomeSelectedDebtorsHaveDiscounts = selectedDebtors.some(
    ({ discounts }) => discounts.length > 0
  );
  const haveSomeSelectedDebtorsPaidSomething = selectedDebtors.some(
    ({ amountPaid }) => amountPaid > 0
  );

  return (
    <>
      <Table
        rowData={debtors ?? []}
        columnDefs={columns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
        onRowSelection={(newSelectedDebtors) => {
          setSelectedDebtorsIds(
            new Set(newSelectedDebtors.map((debtor) => debtor.id))
          );
        }}
        rightAdornment={
          <Fade in={selectedDebtors.length > 0} unmountOnExit>
            <Box>
              <ActionMenu
                menuItems={[
                  {
                    label: doSomeSelectedDebtorsHaveDiscounts
                      ? t('fees:replaceDiscount')
                      : t('fees:addDiscount'),
                    icon: <DiscountIcon />,
                    disabled: haveSomeSelectedDebtorsPaidSomething,
                    disabledTooltip: doSomeSelectedDebtorsHaveDiscounts
                      ? t(
                          'fees:youCanNotReplaceDiscountAsSomePeopleHaveAlreadyPaidFee'
                        )
                      : t(
                          'fees:youCanNotAddDiscountAsSomePeopleHaveAlreadyPaidFee'
                        ),
                    onClick: onOpenAddBulkDiscountModal,
                  },
                  {
                    label: t('fees:removeDiscount', {
                      count: selectedDebtors.length,
                    }),
                    icon: <RemoveDiscountIcon />,
                    hasAccess: () => doSomeSelectedDebtorsHaveDiscounts,
                    disabled: haveSomeSelectedDebtorsPaidSomething,
                    disabledTooltip: t(
                      'fees:youCanNotRemoveDiscountAsSomePeopleHaveAlreadyPaidFee',
                      { count: selectedDebtors.length }
                    ),
                    onClick: onOpenDiscountConfirm,
                  },
                ]}
              />
            </Box>
          </Fade>
        }
      />

      <BulkAddIndividualDiscountModal
        isOpen={isAddBulkDiscountModalOpen}
        onSave={handleSaveIndividualDiscount}
        onClose={onCloseAddBulkDiscountModal}
      />

      <ConfirmDialog
        open={isRemoveDiscountConfirmOpen}
        title={t('fees:removeDiscount', { count: selectedDebtors.length })}
        description={t('fees:areYouSureYouWantToRemoveDiscount', {
          count: selectedDebtors.length,
        })}
        confirmText={t('common:yes')}
        cancelText={t('common:no')}
        onConfirm={removeDiscounts}
        onClose={onCloseDiscountConfirm}
      />
    </>
  );
}
