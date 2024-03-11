import { useParams } from 'react-router-dom';
import { useCallback, useMemo, useRef, useState } from 'react';
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
  ActionMenu,
  useDisclosure,
  ConfirmDialog,
  useListNavigatorSettings,
  ListNavigatorType,
  PartyListNavigatorMenuItemParams,
} from '@tyro/core';

import { StudentTableAvatar } from '@tyro/people';
import {
  BulkAction,
  RecipientSearchType,
  SmsRecipientType,
  getPersonProfileLink,
} from '@tyro/api';
import { Box, Fade } from '@mui/material';
import {
  DiscountIcon,
  MobileIcon,
  PersonCrossIcon,
  RemoveDiscountIcon,
  SendMailIcon,
} from '@tyro/icons';
import { SendSmsModal } from '@tyro/sms';
import { useMailSettings } from '@tyro/mail';
import { ConfirmRemoveStudentsFromFeeDialog } from '../../../components/fees/confirm-remove-students';
import { FeeStatusChip } from '../../../components/common/fee-status-chip';
import {
  ReturnTypeFromUseFeeDebtors,
  useFeeDebtors,
} from '../../../api/debtors';
import { BulkAddIndividualDiscountModal } from '../../../components/fees/form/bulk-add-individual-discount-modal';
import { ReturnTypeFromUseDiscounts } from '../../../api/discounts';
import { useBulkApplyDiscounts } from '../../../api/bulk-apply-discounts';
import { getDiscountName } from '../../../utils/get-discount-name';
import { useFees } from '../../../api/fees';

const getFeeOverviewColumns = (
  t: TFunction<('common' | 'fees')[], undefined, ('common' | 'fees')[]>,
  onBeforeNavigate: () => void,
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
          onBeforeNavigate={onBeforeNavigate}
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
    valueFormatter: ({ data }) => formatCurrency(data?.amount ?? 0),
    comparator: (a: number, b: number) => a - b,
    type: 'numericColumn',
  },
  {
    field: 'amountPaid',
    headerName: t('fees:paid'),
    valueFormatter: ({ data }) => formatCurrency(data?.amountPaid ?? 0),
    comparator: (a: number, b: number) => a - b,
    type: 'numericColumn',
  },
  {
    field: 'amountDue',
    headerName: t('fees:due'),
    valueFormatter: ({ data }) => formatCurrency(data?.amountDue ?? 0),
    comparator: (a: number, b: number) => a - b,
    type: 'numericColumn',
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
  const feeId = getNumber(id) ?? 0;
  const { t } = useTranslation(['common', 'fees', 'people', 'mail', 'sms']);
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
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();
  const {
    isOpen: isRemoveStudentsConfirmOpen,
    onOpen: onOpenRemoveStudentsConfirm,
    onClose: onCloseRemoveStudentsConfirm,
  } = useDisclosure();

  const { data: debtors } = useFeeDebtors({
    ids: [feeId],
  });

  const { data: feesData } = useFees({ ids: [feeId ?? 0] });

  const { mutateAsync: bulkApplyDiscounts } = useBulkApplyDiscounts();
  const { sendMailToParties } = useMailSettings();

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

  const visibleDataRef = useRef<() => ReturnTypeFromUseFeeDebtors[]>(null);

  const { storeList } =
    useListNavigatorSettings<PartyListNavigatorMenuItemParams>({
      type: ListNavigatorType.Student,
    });

  const onBeforeNavigateProfile = useCallback(() => {
    storeList(
      feesData?.[0]?.name,
      visibleDataRef.current?.().map(({ person, classGroup }) => ({
        id: person.partyId,
        type: 'person',
        name: displayName(person),
        firstName: person.firstName,
        lastName: person.lastName,
        avatarUrl: person.avatarUrl,
        caption: classGroup?.name,
      }))
    );
  }, [feesData]);

  const columns = useMemo(
    () =>
      getFeeOverviewColumns(
        t,
        onBeforeNavigateProfile,
        displayName,
        formatCurrency
      ),
    [t, onBeforeNavigateProfile, displayName, formatCurrency]
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
        visibleDataRef={visibleDataRef}
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
                  [
                    {
                      label: t('people:sendSms'),
                      icon: <MobileIcon />,
                      onClick: onOpenSendSms,
                      hasAccess: ({ isStaffUserWithPermission }) =>
                        isStaffUserWithPermission(
                          'ps:1:communications:send_sms'
                        ),
                    },
                    {
                      label: t('mail:mailContacts'),
                      icon: <SendMailIcon />,
                      hasAccess: ({ isStaffUserWithPermission }) =>
                        isStaffUserWithPermission(
                          'api:communications:read:search_recipients'
                        ),
                      onClick: () => {
                        sendMailToParties(
                          selectedDebtors.map(({ person }) => person.partyId),
                          [
                            {
                              label: t('mail:contactsOfStudent', {
                                count: selectedDebtors.length,
                              }),
                              type: RecipientSearchType.StudentContacts,
                            },
                          ]
                        );
                      },
                    },
                  ],
                  [
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
                    {
                      label: t('fees:removeStudent', {
                        count: selectedDebtors.length,
                      }),
                      icon: <PersonCrossIcon />,
                      disabled: haveSomeSelectedDebtorsPaidSomething,
                      disabledTooltip: t(
                        'fees:youCanNotRemoveStudentAsSomeHaveAlreadyPaidFee',
                        { count: selectedDebtors.length }
                      ),
                      onClick: onOpenRemoveStudentsConfirm,
                    },
                  ],
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

      <ConfirmRemoveStudentsFromFeeDialog
        open={isRemoveStudentsConfirmOpen}
        onClose={onCloseRemoveStudentsConfirm}
        feeId={feeId}
        students={selectedDebtors}
      />

      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={selectedDebtors.map(({ person }) => {
          const { partyId, avatarUrl } = person;
          return {
            id: partyId,
            name: displayName(person),
            type: 'individual',
            avatarUrl,
          };
        })}
        possibleRecipientTypes={[
          {
            label: t('sms:contactsOfStudent', {
              count: selectedDebtors.length,
            }),
            type: SmsRecipientType.Student,
          },
        ]}
      />
    </>
  );
}
