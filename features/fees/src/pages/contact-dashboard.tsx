import {
  GridOptions,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useFormatNumber, useTranslation } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { AddIcon } from '@tyro/icons';

dayjs.extend(LocalizedFormat);

// const getColumnDefs = (
//   t: TFunction<('sms' | 'common')[], undefined, ('sms' | 'common')[]>,
//   displayName: ReturnTypeDisplayName,
//   formatCurrency: ReturnType<typeof useFormatNumber>['formatCurrency'],
//   setRowToViewDetails: Dispatch<SetStateAction<ReturnTypeFromUseSentSms>>
// ): GridOptions<ReturnTypeFromUseSentSms>['columnDefs'] => [
//     {
//       field: 'name',
//       headerName: t('sms:recipients'),
//     },
//     {
//       field: 'numRecipients',
//       headerName: t('sms:numberOfRecipients'),
//     },
//     {
//       field: 'sentOn',
//       headerName: t('sms:sentAt'),
//       valueGetter: ({ data }) => (data ? dayjs(data.sentOn).format('LLL') : null),
//       sort: 'desc',
//       comparator: (dateA: string, dateB: string) =>
//         dayjs(dateA).unix() - dayjs(dateB).unix(),
//     },
//     {
//       field: 'sender',
//       headerName: t('sms:sentBy'),
//       valueGetter: ({ data }) => (data ? displayName(data.sender) : null),
//     },
//     {
//       field: 'totalCost',
//       headerName: t('sms:totalCost'),
//       valueGetter: ({ data }) =>
//         data?.totalCost ? formatCurrency(data.totalCost) : null,
//       type: 'numericColumn',
//     },
//   ];

export default function ContactDashboard() {
  const { t } = useTranslation(['common', 'sms', 'navigation']);
  const { displayName } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();

  // const columnDefs = useMemo(
  //   () => getColumnDefs(t, displayName, formatCurrency),
  //   [t, displayName, formatCurrency]
  // );

  return (
    <PageContainer title={t('navigation:management.fees')}>
      <PageHeading
        title={t('navigation:management.fees')}
        titleProps={{ variant: 'h3' }}
      />
      {/* <Table
          rowData={sentSms || []}
          columnDefs={columnDefs}
          getRowId={({ data }) => String(data?.id)}
        /> */}
    </PageContainer>
  );
}
