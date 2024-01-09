import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  TableBooleanValue,
  TablePersonAvatar,
  useDebouncedValue,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, Button } from '@mui/material';
import { AddIcon, EditIcon, VerticalDotsIcon } from '@tyro/icons';
import {
  UpsertFeeCategoryModal,
  UpsertFeeCategoryModalProps,
} from '../components/fees/upsert-fee-category';
import {
  ReturnTypeFromUseFeesCategories,
  useFeesCategories,
} from '../api/fees-categories';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<'common'[]>,
  displayName: ReturnTypeDisplayName,
  onClickEdit: Dispatch<SetStateAction<UpsertFeeCategoryModalProps['value']>>
): GridOptions<ReturnTypeFromUseFeesCategories>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
  },
  {
    field: 'description',
    headerName: t('common:description'),
    valueGetter: ({ data }) => data?.description || '-',
  },
  {
    field: 'active',
    headerName: t('common:active'),
    valueFormatter: ({ data }) =>
      data?.active ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFeesCategories>) => (
      <TableBooleanValue value={Boolean(data?.active)} />
    ),
  },
  {
    field: 'createdBy',
    headerName: t('common:createdBy'),
    valueGetter: ({ data }) => displayName(data?.createdBy),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFeesCategories>) =>
      data?.createdBy ? <TablePersonAvatar person={data?.createdBy} /> : '-',
  },
  {
    suppressColumnsToolPanel: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFeesCategories>) =>
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

export default function CategoriesPage() {
  const { t } = useTranslation(['common', 'navigation', 'fees']);
  const { displayName } = usePreferredNameLayout();

  const { data: feesData } = useFeesCategories({});

  const {
    value: feeCategory,
    debouncedValue: debouncedFeeCategory,
    setValue: setFeeCategory,
  } = useDebouncedValue<UpsertFeeCategoryModalProps['value']>({
    defaultValue: null,
  });

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName, setFeeCategory),
    [t, displayName, setFeeCategory]
  );

  return (
    <PageContainer title={t('navigation:management.fees.categories')}>
      <PageHeading
        title={t('navigation:management.fees.categories')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFeeCategory({})}
            >
              {t('fees:createFeeCategory')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={feesData || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.id)}
      />
      <UpsertFeeCategoryModal
        open={!!feeCategory}
        value={feeCategory || debouncedFeeCategory}
        onClose={() => setFeeCategory(null)}
      />
    </PageContainer>
  );
}
