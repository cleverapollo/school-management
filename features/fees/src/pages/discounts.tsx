import {
  GridOptions,
  PageContainer,
  PageHeading,
  Table,
  ICellRendererParams,
  TableBooleanValue,
  TablePersonAvatar,
  ReturnTypeDisplayName,
  usePreferredNameLayout,
  useDebouncedValue,
  ActionMenu,
} from '@tyro/core';
import { TFunction, useTranslation, useFormatNumber } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, Button } from '@mui/material';
import { AddIcon, EditIcon, VerticalDotsIcon } from '@tyro/icons';
import { DiscountType } from '@tyro/api';
import { ReturnTypeFromUseDiscounts, useDiscounts } from '../api/discounts';
import {
  UpsertDiscountModal,
  UpsertDiscountModalProps,
} from '../components/discounts/upsert-discount-modal';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<('fees' | 'common')[]>,
  displayName: ReturnTypeDisplayName,
  formatCurrency: ReturnType<typeof useFormatNumber>['formatCurrency'],
  onClickEdit: Dispatch<SetStateAction<UpsertDiscountModalProps['value']>>
): GridOptions<ReturnTypeFromUseDiscounts>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
  },
  {
    field: 'description',
    headerName: t('common:description'),
    valueFormatter: ({ data }) => data?.description || '-',
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
  {
    field: 'active',
    headerName: t('common:active'),
    valueFormatter: ({ data }) =>
      data?.active ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseDiscounts>) => (
      <TableBooleanValue value={Boolean(data?.active)} />
    ),
  },
  {
    field: 'createdBy',
    headerName: t('common:createdBy'),
    valueGetter: ({ data }) => displayName(data?.createdBy),
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseDiscounts>) =>
      data?.createdBy ? <TablePersonAvatar person={data?.createdBy} /> : '-',
  },
  {
    suppressColumnsToolPanel: true,
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseDiscounts>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('common:actions.edit'),
              icon: <EditIcon />,
              onClick: () => onClickEdit(data),
            },
          ]}
        />
      ),
  },
];

export default function DiscountsPage() {
  const { t } = useTranslation(['common', 'navigation', 'fees']);

  const { displayName } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();

  const { data: discountsData } = useDiscounts({});

  const {
    value: discount,
    debouncedValue: debouncedDiscount,
    setValue: setDiscount,
  } = useDebouncedValue<UpsertDiscountModalProps['value']>({
    defaultValue: null,
  });

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName, formatCurrency, setDiscount),
    [t, displayName, formatCurrency, setDiscount]
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
        open={!!discount}
        value={discount || debouncedDiscount}
        onClose={() => setDiscount(null)}
      />
    </PageContainer>
  );
}
