import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  TableAvatar,
  useDisclosure,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useFormatNumber, useTranslation } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useUser } from '@tyro/api';
import { Button, Fade } from '@mui/material';
import {
  ReturnTypeFromUseStudentFees,
  useStudentFees,
} from '../api/student-fees';
import { PayFeesModal } from '../components/common/pay-fees-modal';

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
    field: 'amount',
    headerName: t('fees:amount'),
    valueGetter: ({ data }) => formatCurrency(data?.amount ?? 0),
    type: 'numericColumn',
  },
  {
    field: 'amountPaid',
    headerName: t('fees:amountPaid'),
    valueGetter: ({ data }) => formatCurrency(data?.amountPaid ?? 0),
    type: 'numericColumn',
  },
];

export default function ContactDashboard() {
  const { t } = useTranslation(['common', 'fees', 'navigation']);
  const { activeProfile } = useUser();
  const { displayName } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();
  const [selectedStudentFees, setSelectedStudentFees] = useState<
    ReturnTypeFromUseStudentFees[]
  >([]);

  const {
    isOpen: isPayFeesModalOpen,
    onOpen: onOpenPayFeesModal,
    onClose: onClosePayFeesModal,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  const { data: studentFees } = useStudentFees({
    contactPartyId: activeProfile?.partyId,
  });

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName, formatCurrency),
    [t, displayName, formatCurrency]
  );

  return (
    <>
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
          rightAdornment={
            <Fade in={selectedStudentFees.length > 0} unmountOnExit>
              <Button
                variant="contained"
                color="primary"
                onClick={onOpenPayFeesModal}
              >
                {t('fees:pay')}
              </Button>
            </Fade>
          }
          onRowSelection={setSelectedStudentFees}
        />
      </PageContainer>
      <PayFeesModal
        open={isPayFeesModalOpen}
        onClose={onClosePayFeesModal}
        feesToPay={selectedStudentFees}
      />
    </>
  );
}
