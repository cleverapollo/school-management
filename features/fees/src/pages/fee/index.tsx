import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  Table,
} from '@tyro/core';
import { TFunction, useTranslation, useFormatNumber } from '@tyro/i18n';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, Button, Stack, Chip } from '@mui/material';
import { AddIcon, EditIcon, VerticalDotsIcon } from '@tyro/icons';
import { getColorBasedOnIndex, usePermissions } from '@tyro/api';
import { Link } from 'react-router-dom';
import { ReturnTypeFromUseFees, useFees } from '../../api/fees';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<('fees' | 'common')[]>,
  formatCurrency: ReturnType<typeof useFormatNumber>['formatCurrency'],
  hasPermission: boolean
): GridOptions<ReturnTypeFromUseFees>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
  },
  {
    field: 'categories',
    headerName: t('fees:feeCategory'),
    filter: true,
    sortable: true,
    autoHeight: true,
    wrapText: true,
    width: 300,
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
  // TODO: uncomment when BE sends it
  // {
  //   field: 'paid',
  //   headerName: t('common:paid'),
  //   valueGetter: ({ data }) => formatCurrency(data?.paid ?? 0),
  // },
  // {
  //     field: 'createdBy',
  //     headerName: t('common:createdBy'),
  //     valueGetter: ({ data }) => displayName(data?.createdBy),
  //     cellRenderer: ({
  //       data,
  //     }: ICellRendererParams<ReturnTypeFromUseFees>) =>
  //       data?.createdBy ? <TablePersonAvatar person={data?.createdBy} /> : '-',
  //   },
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
          ]}
        />
      ),
  },
];

export default function OverviewPage() {
  const { t } = useTranslation(['common', 'fees']);
  const { formatCurrency } = useFormatNumber();

  const { data: feesData } = useFees({});

  const { isStaffUserWithPermission } = usePermissions();
  const hasPermission = isStaffUserWithPermission('ps:1:fees:write_fees');

  const columnDefs = useMemo(
    () => getColumnDefs(t, formatCurrency, hasPermission),
    [t, formatCurrency, hasPermission]
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
    </PageContainer>
  );
}
