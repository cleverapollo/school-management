import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  TablePersonAvatar,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation, useFormatNumber } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, Button, Stack, Chip } from '@mui/material';
import { AddIcon, EditIcon, TrashIcon, VerticalDotsIcon } from '@tyro/icons';
import {
  Colour,
  FeeStatus,
  getColorBasedOnIndex,
  usePermissions,
} from '@tyro/api';
import { Link } from 'react-router-dom';
import { ReturnTypeFromUseFees, useFees } from '../../api/fees';
import { DeleteFeeConfirmModal } from '../../components/fees/delete-fee-confirm-modal';

dayjs.extend(LocalizedFormat);

const statusColor: Record<FeeStatus, Colour> = {
  [FeeStatus.Complete]: Colour.Green,
  [FeeStatus.Outstanding]: Colour.Blue,
  [FeeStatus.Overdue]: Colour.Red,
};

const getColumnDefs = (
  t: TFunction<('fees' | 'common')[]>,
  displayName: ReturnTypeDisplayName,
  formatCurrency: ReturnType<typeof useFormatNumber>['formatCurrency'],
  hasPermission: boolean,
  setFeeToDelete: Dispatch<SetStateAction<ReturnTypeFromUseFees | null>>
): GridOptions<ReturnTypeFromUseFees>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
  },
  {
    field: 'amount',
    headerName: t('fees:amount'),
    valueGetter: ({ data }) => formatCurrency(data?.amount ?? 0),
  },
  {
    field: 'categories',
    headerName: t('common:category'),
    valueGetter: ({ data }) => data?.categories?.map(({ name }) => name),
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseFees, any>) =>
      data?.categories ? (
        <Stack direction="row" gap={1} my={1} flexWrap="wrap">
          {data.categories.map(({ id, name }) => (
            <Chip
              key={id}
              label={name}
              variant="soft"
              color={getColorBasedOnIndex(id)}
            />
          ))}
        </Stack>
      ) : null,
  },
  {
    field: 'feeType',
    headerName: t('common:type'),
    valueGetter: ({ data }) =>
      data?.feeType ? t(`fees:feesType.${data?.feeType}`) : '-',
  },
  {
    field: 'dueDate',
    headerName: t('fees:dueBy'),
    valueFormatter: ({ data }) =>
      data?.dueDate ? dayjs(data.dueDate).format('LL') : '-',
  },
  {
    field: 'total',
    headerName: t('common:total'),
    valueGetter: ({ data }) => formatCurrency(data?.total ?? 0),
  },
  {
    field: 'paid',
    headerName: t('common:paid'),
    valueGetter: ({ data }) => formatCurrency(data?.paid ?? 0),
  },
  {
    field: 'due',
    headerName: t('fees:due'),
    valueGetter: ({ data }) => formatCurrency(data?.paid ?? 0),
  },
  {
    field: 'feeStatus',
    headerName: t('common:status'),
    valueGetter: ({ data }) =>
      data?.feeStatus ? t(`fees:feeStatus.${data.feeStatus}`) : '-',
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseFees, any>) =>
      data?.feeStatus ? (
        <Chip
          label={t(`fees:feeStatus.${data.feeStatus}`)}
          variant="soft"
          color={statusColor[data.feeStatus]}
        />
      ) : null,
  },
  {
    field: 'createdBy',
    headerName: t('common:createdBy'),
    valueGetter: ({ data }) => displayName(data?.createdBy),
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseFees>) =>
      data?.createdBy ? <TablePersonAvatar person={data?.createdBy} /> : '-',
  },
  {
    suppressColumnsToolPanel: true,
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseFees>) =>
      data &&
      hasPermission && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('common:actions.edit'),
              icon: <EditIcon />,
              navigateTo: `/fees/edit/${data.id || ''}`,
            },
            {
              label: t('common:actions.delete'),
              icon: <TrashIcon />,
              onClick: () => {
                setFeeToDelete(data);
              },
            },
          ]}
        />
      ),
  },
];

export default function OverviewPage() {
  const { t } = useTranslation(['common', 'fees']);
  const { displayName } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();

  const { data: feesData } = useFees({});

  const { isStaffUserWithPermission } = usePermissions();
  const hasPermission = isStaffUserWithPermission('ps:1:fees:write_fees');

  const [feeToDelete, setFeeToDelete] = useState<ReturnTypeFromUseFees | null>(
    null
  );

  const columnDefs = useMemo(
    () =>
      getColumnDefs(
        t,
        displayName,
        formatCurrency,
        hasPermission,
        setFeeToDelete
      ),
    [t, displayName, formatCurrency, hasPermission, setFeeToDelete]
  );

  return (
    <PageContainer title={t('fees:feesOverview')}>
      <PageHeading
        title={t('fees:feesOverview')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          hasPermission ? (
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                component={Link}
                to="/fees/create"
                startIcon={<AddIcon />}
              >
                {t('fees:createFee')}
              </Button>
            </Box>
          ) : null
        }
      />
      <Table
        rowData={feesData || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.id)}
      />
      <DeleteFeeConfirmModal
        open={!!feeToDelete}
        feeToDelete={feeToDelete!}
        onClose={() => setFeeToDelete(null)}
      />
    </PageContainer>
  );
}
