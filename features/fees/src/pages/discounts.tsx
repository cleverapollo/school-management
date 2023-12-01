import {
  GridOptions,
  PageContainer,
  PageHeading,
  Table,
  ICellRendererParams,
  TableBooleanValue,
} from '@tyro/core';
import { TFunction, useTranslation, useFormatNumber } from '@tyro/i18n';
import { useDeferredValue, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, Button } from '@mui/material';
import { AddIcon } from '@tyro/icons';
import { DiscountType } from '@tyro/api';
import { ReturnTypeFromUseDiscounts, useDiscounts } from '../api/discounts';
import {
  UpsertDiscountModal,
  UpsertDiscountModalProps,
} from '../components/discounts/upsert-discount-modal';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<('fees' | 'common')[]>,
  formatCurrency: ReturnType<typeof useFormatNumber>['formatCurrency']
): GridOptions<ReturnTypeFromUseDiscounts>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
  },
  {
    field: 'description',
    headerName: t('common:description'),
  },
  {
    field: 'discountType',
    headerName: t('fees:discountType'),
    valueFormatter: ({ data }) =>
      data?.discountType ? t(`fees:discountsType.${data.discountType}`) : '',
  },
  {
    field: 'value',
    headerName: t('fees:value'),
    valueGetter: ({ data }) => {
      const { value = 0, discountType } = data || {};
      if (!value || !discountType) return '-';

      if (discountType === DiscountType.Fixed) {
        return formatCurrency(value);
      }

      return `%${value}`;
    },
  },
  {
    field: 'siblingDiscount',
    headerName: t('fees:siblingDiscount'),
    valueFormatter: ({ data }) =>
      data?.siblingDiscount ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseDiscounts>) => (
      <TableBooleanValue value={Boolean(data?.siblingDiscount)} />
    ),
  },
];

type DiscountValue = UpsertDiscountModalProps['value'];

export default function DiscountsPage() {
  const { t } = useTranslation(['common', 'navigation', 'fees']);
  const { formatCurrency } = useFormatNumber();

  const { data: discountsData } = useDiscounts({});

  const [discount, setDiscount] = useState<DiscountValue>(null);
  const deferredDiscount = useDeferredValue(discount);

  const columnDefs = useMemo(
    () => getColumnDefs(t, formatCurrency),
    [t, formatCurrency]
  );

  return (
    <PageContainer title={t('navigation:management.fees.discounts')}>
      <PageHeading
        title={t('navigation:management.fees.discounts')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDiscount({})}
            >
              {t('fees:createDiscount')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={discountsData || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.id)}
      />
      <UpsertDiscountModal
        value={discount}
        open={!!deferredDiscount}
        onClose={() => setDiscount(null)}
      />
    </PageContainer>
  );
}
