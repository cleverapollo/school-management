import { GridOptions, PageContainer, PageHeading, Table } from '@tyro/core';
import { TFunction, useTranslation, useFormatNumber } from '@tyro/i18n';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, Button } from '@mui/material';
import { AddIcon } from '@tyro/icons';
import { ReturnTypeFromUseFees, useFees } from '../api/fees';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<('fees' | 'common')[]>,
  formatCurrency: ReturnType<typeof useFormatNumber>['formatCurrency']
): GridOptions<ReturnTypeFromUseFees>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
  },
  {
    field: 'dueDate',
    headerName: t('fees:dueDate'),
    valueFormatter: ({ data }) =>
      data?.dueDate ? dayjs(data.dueDate).format('LL') : '-',
  },
  {
    field: 'amount',
    headerName: t('fees:total'),
    valueGetter: ({ data }) => {
      const { amount = 0 } = data || {};
      return formatCurrency(amount);
    },
  },
];

export default function OverviewPage() {
  const { t } = useTranslation(['common', 'navigation', 'fees']);
  const { formatCurrency } = useFormatNumber();

  const { data: feesData } = useFees({});

  const columnDefs = useMemo(
    () => getColumnDefs(t, formatCurrency),
    [t, formatCurrency]
  );

  return (
    <PageContainer title={t('navigation:management.fees.overview')}>
      <PageHeading
        title={t('navigation:management.fees.overview')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button variant="contained" startIcon={<AddIcon />}>
              {t('fees:createFee')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={feesData || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.id)}
      />
    </PageContainer>
  );
}
