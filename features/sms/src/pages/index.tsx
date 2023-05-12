import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { UseQueryReturnType } from '@tyro/api';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Link } from '@mui/material';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useSentSms } from '../api/sent-sms';

dayjs.extend(LocalizedFormat);

type ReturnTypeFromUseSentSms = UseQueryReturnType<typeof useSentSms>[number];

const getColumnDefs = (
  translate: TFunction<('sms' | 'common')[], undefined, ('sms' | 'common')[]>,
  displayName: ReturnTypeDisplayName,
  setRowToViewDetails: Dispatch<SetStateAction<ReturnTypeFromUseSentSms>>
): GridOptions<ReturnTypeFromUseSentSms>['columnDefs'] => [
  {
    field: 'name',
    headerName: translate('sms:recipients'),
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseSentSms>) =>
      data && (
        <Link component="button" onClick={() => setRowToViewDetails(data)}>
          {data.name}
        </Link>
      ),
  },
  {
    field: 'numRecipients',
    headerName: translate('sms:numberOfRecipients'),
  },
  {
    field: 'sentOn',
    headerName: translate('sms:sentAt'),
    valueGetter: ({ data }) => (data ? dayjs(data.sentOn).format('LLL') : null),
    sort: 'desc',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'sender',
    headerName: translate('sms:sentBy'),
    valueGetter: ({ data }) => (data ? displayName(data.sender) : null),
  },
  {
    field: 'totalCost',
    headerName: translate('sms:totalCost'),
    valueGetter: ({ data }) => (data?.totalCost ? `€${data.totalCost}` : null),
  },
];

export default function SmsList() {
  const { t } = useTranslation(['common', 'sms', 'navigation']);
  const [rowToViewDetails, setRowToViewDetails] =
    useState<ReturnTypeFromUseSentSms>(null);
  const { displayName } = usePreferredNameLayout();
  const { data: sentSms } = useSentSms({
    ids: [],
  });

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName, setRowToViewDetails),
    [t, displayName, setRowToViewDetails]
  );

  return (
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
  );
}
