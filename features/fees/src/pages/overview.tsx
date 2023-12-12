import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  Table,
  useDebouncedValue,
} from '@tyro/core';
import { TFunction, useTranslation, useFormatNumber } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, Button } from '@mui/material';
import { AddIcon, EditIcon, VerticalDotsIcon } from '@tyro/icons';
import { ReturnTypeFromUseFees, useFees } from '../api/fees';
import {
  UpsertFeeModal,
  UpsertFeeModalProps,
} from '../components/fees/upsert-fee-modal';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<('fees' | 'common')[]>,
  formatCurrency: ReturnType<typeof useFormatNumber>['formatCurrency'],
  onClickEdit: Dispatch<SetStateAction<UpsertFeeModalProps['value']>>
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
    field: 'feeType',
    headerName: t('fees:feeType'),
    valueGetter: ({ data }) =>
      data?.feeType ? t(`fees:feesType.${data?.feeType}`) : '-',
  },
  {
    field: 'amount',
    headerName: t('fees:total'),
    valueGetter: ({ data }) => {
      const { amount = 0 } = data || {};
      return formatCurrency(amount);
    },
  },
  {
    suppressColumnsToolPanel: true,
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseFees>) =>
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

export default function OverviewPage() {
  const { t } = useTranslation(['common', 'navigation', 'fees']);
  const { formatCurrency } = useFormatNumber();

  const { data: feesData } = useFees({});

  const {
    value: fee,
    debouncedValue: debouncedFee,
    setValue: setFee,
  } = useDebouncedValue<UpsertFeeModalProps['value']>({
    defaultValue: null,
  });

  const columnDefs = useMemo(
    () => getColumnDefs(t, formatCurrency, setFee),
    [t, formatCurrency, setFee]
  );

  return (
    <PageContainer title={t('navigation:management.fees.overview')}>
      <PageHeading
        title={t('navigation:management.fees.overview')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFee({})}
            >
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
      <UpsertFeeModal
        open={!!fee}
        value={fee || debouncedFee}
        onClose={() => setFee(null)}
      />
    </PageContainer>
  );
}
