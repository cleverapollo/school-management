import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  Table,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useFormatNumber, useTranslation } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  ReturnTypeFromUseInfoRequestFormList,
  useInfoRequestFormList,
} from '../api/form-list';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<'common'[], undefined, 'common'[]>
): GridOptions<ReturnTypeFromUseInfoRequestFormList>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('sms:recipients'),
  },
  {
    field: 'numRecipients',
    headerName: t('sms:numberOfRecipients'),
  },
  {
    field: 'sentOn',
    headerName: t('sms:sentAt'),
    valueGetter: ({ data }) => (data ? dayjs(data.sentOn).format('LLL') : null),
    sort: 'desc',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'sender',
    headerName: t('sms:sentBy'),
    valueGetter: ({ data }) => (data ? displayName(data.sender) : null),
  },
  {
    field: 'totalCost',
    headerName: t('sms:totalCost'),
    valueGetter: ({ data }) =>
      data?.totalCost ? formatCurrency(data.totalCost) : null,
    type: 'numericColumn',
  },
  {
    headerName: '',
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseSentSms>) =>
      data && (
        <Button onClick={() => setRowToViewDetails(data)}>
          {t('common:actions.viewDetails')}
        </Button>
      ),
  },
];

export default function InfoRequestFormList() {
  const { t } = useTranslation(['common', 'navigation']);
  const { displayName } = usePreferredNameLayout();

  const { data: sentSms } = useInfoRequestFormList({
    ids: [],
  });

  const columnDefs = useMemo(() => getColumnDefs(t), [t, displayName]);

  return (
    <>
      <PageContainer title={t('navigation:management.sms')}>
        <PageHeading
          title={t('navigation:management.sms')}
          titleProps={{ variant: 'h3' }}
        />
        <Table
          rowData={sentSms || []}
          columnDefs={columnDefs}
          getRowId={({ data }) => String(data?.id)}
        />
      </PageContainer>
      <SentSmsDetailsModal
        isOpen={!!rowToViewDetails}
        data={rowToViewDetails || debouncedRowToViewDetails}
        onClose={() => setRowToViewDetails(null)}
      />
    </>
  );
}
