import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  useDebouncedValue,
  useDisclosure,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useFormatNumber, useTranslation } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { ReturnTypeFromUseSentSms, useSentSms } from '../api/sent-sms';
import { SentSmsDetailsModal } from '../components/sent-sms-details-modal';
import { useSmsSpend } from '../api/sms-spend';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<('sms' | 'common')[], undefined, ('sms' | 'common')[]>,
  displayName: ReturnTypeDisplayName,
  formatCurrency: ReturnType<typeof useFormatNumber>['formatCurrency'],
  setRowToViewDetails: Dispatch<SetStateAction<ReturnTypeFromUseSentSms>>
): GridOptions<ReturnTypeFromUseSentSms>['columnDefs'] => [
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

export default function SmsList() {
  const { t } = useTranslation(['common', 'sms', 'navigation']);
  const {
    value: rowToViewDetails,
    debouncedValue: debouncedRowToViewDetails,
    setValue: setRowToViewDetails,
  } = useDebouncedValue<ReturnTypeFromUseSentSms>({ defaultValue: null });
  const { displayName } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();

  const { data: smsSpend } = useSmsSpend();
  const { data: sentSms } = useSentSms({
    ids: [],
  });

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName, formatCurrency, setRowToViewDetails),
    [t, displayName, formatCurrency, setRowToViewDetails]
  );

  return (
    <>
      <PageContainer title={t('navigation:management.sms')}>
        <PageHeading
          title={t('navigation:management.sms')}
          titleProps={{ variant: 'h3' }}
          rightAdornment={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack
                sx={{
                  '& > *': {
                    textAlign: 'right',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  component="h2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {t('sms:currentMonthlySpend')}
                </Typography>
                <Typography variant="body1" component="span">
                  {formatCurrency(smsSpend ?? 0)}
                </Typography>
              </Stack>
            </Stack>
          }
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
