import { Button, Box } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useMemo } from 'react';
import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  RouterLink,
  Table,
  TableBooleanValue,
  TableSwitch,
  BulkEditedRows,
  useDebouncedValue,
} from '@tyro/core';
import set from 'lodash/set';
import { AddIcon } from '@tyro/icons';
import { SaveCommentBankInput, CommentBank } from '@tyro/api';
import { useCreateCommentBank } from '../../api/comment-banks/save-comment-bank';
import {
  useCommentBanks,
  ReturnTypeFromCommentBanks,
} from '../../api/comment-banks/comment-banks';
import {
  AddCommentBank,
  AddCommentBankProps,
} from '../../components/comment-bank/add-comment-bank';

const getCommentBankColumns = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromCommentBanks>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'name',
    editable: true,
    cellEditor: 'agCellEditor',
    cellClass: ['ag-editable-cell'],
    valueGetter: ({ data }) => data?.name || '-',
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'name', newValue);
      return true;
    },
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromCommentBanks>) =>
      data && <RouterLink to={`./${data?.id ?? ''}`}>{data?.name}</RouterLink>,
    sort: 'asc',
  },
  {
    headerName: t('common:description'),
    field: 'description',
    editable: true,
    cellEditor: 'agCellEditor',
    cellClass: ['ag-editable-cell'],
    valueGetter: ({ data }) => data?.description || '-',
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'description', newValue);
      return true;
    },
  },
  {
    headerName: t('settings:commentBanks.comments'),
    field: 'comments',
    valueGetter: ({ data }) => data?.comments?.length,
  },
  {
    headerName: t('settings:active'),
    field: 'active',
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.active ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromCommentBanks, any>) => (
      <TableBooleanValue value={Boolean(data?.active)} />
    ),
  },
];

export default function CommentBanks() {
  const { t } = useTranslation(['common', 'navigation', 'settings']);

  const { data: commentBanks } = useCommentBanks({});
  const { mutateAsync: createCommentBank } = useCreateCommentBank();

  const {
    value: commentBank,
    debouncedValue: debouncedCommentBank,
    setValue: setCommentBank,
  } = useDebouncedValue<AddCommentBankProps['initialModalState']>({
    defaultValue: null,
  });

  const handleAddCondition = () => {
    setCommentBank({});
  };

  const getColumns = useMemo(() => getCommentBankColumns(t), [t]);

  const handleBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromCommentBanks,
      'id' | 'name' | 'description' | 'active' | 'comments'
    >
  ) => {
    const formattedData = Object.keys(data).flatMap((idStr) =>
      (commentBanks || [])
        .filter(
          (currentCommentBank) => idStr === currentCommentBank.id.toString()
        )
        .map((current) => {
          const editedData = data[current.id.toString()];

          if (editedData && editedData.name) {
            current.name = editedData.name.newValue;
          }
          if (editedData && editedData.description) {
            current.description = editedData.description.newValue;
          }
          if (editedData && editedData.active) {
            current.active = editedData.active.newValue;
          }

          return current;
        })
    );
    return createCommentBank(formattedData as [SaveCommentBankInput]);
  };

  return (
    <PageContainer title={t('navigation:management.settings.commentBanks')}>
      <PageHeading
        title={t('navigation:management.settings.commentBanks')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={handleAddCondition}
              startIcon={<AddIcon />}
            >
              {t('settings:commentBanks.addCommentBank')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={commentBanks || []}
        columnDefs={getColumns}
        getRowId={({ data }) => String(data?.id)}
        onBulkSave={handleBulkSave}
      />
      <AddCommentBank
        initialModalState={commentBank || debouncedCommentBank}
        onClose={() => setCommentBank(null)}
      />
    </PageContainer>
  );
}
