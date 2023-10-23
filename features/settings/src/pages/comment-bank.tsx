import { Button, Box } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ActionMenu,
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
import {
  AddIcon,
  EditIcon,
  ExternalLinkIcon,
  VerticalDotsIcon,
} from '@tyro/icons';
import { SaveCommentBankInput } from '@tyro/api';
import { useCreateCommentBank } from '../api/comment-banks/save-comment-bank';
import {
  useCommentBanks,
  ReturnTypeFromCommentBanks,
} from '../api/comment-banks/comment-banks';
import {
  AddCommentBank,
  AddCommentBankProps,
} from '../components/comment-bank/add-comment-bank';

const getCommentBankColumns = (
  onClickEdit: Dispatch<
    SetStateAction<AddCommentBankProps['initialModalState']>
  >,
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromCommentBanks>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'name',
    editable: true,
    cellEditor: 'agCellEditor',
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    // valueGetter: ({ data }) => data?.name || '-',
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
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    // valueGetter: ({ data }) => data?.description || '-',
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
  {
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromCommentBanks>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('settings:commentBanks.editCommentBank'),
              icon: <EditIcon />,
              // @ts-ignore
              onClick: () => onClickEdit(data),
            },
          ]}
        />
      ),
  },
];

export default function CommentBanks() {
  const { t } = useTranslation(['common', 'navigation', 'settings']);

  const { data: commentBanks } = useCommentBanks({});
  const { mutate: createCommentBank, isLoading } = useCreateCommentBank();

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

  const getColumns = useMemo(
    () => getCommentBankColumns(setCommentBank, t),
    [setCommentBank, t]
  );

  const handleBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromCommentBanks,
      'id' | 'name' | 'description' | 'active' | 'comments'
    >
  ) => {
    Object.keys(data).forEach((idStr) => {
      const id = Number(idStr);

      // Find the item from commentBanks using the ID
      const commentBankItem = commentBanks?.find((item) => item.id === id);

      if (!commentBankItem) {
        console.error(`Could not find comment bank item id`);
        return;
      }

      // Use the newValue from data if available, otherwise use the original value from commentBankItem
      // const updatedItem = {
      //   id: commentBankItem.id,
      //   name: commentBankItem.name, // Assuming name cannot be edited in bulk
      //   description: commentBankItem.description,
      //   comments: commentBankItem.comments,
      //   active: commentBankItem.active,
      // };

      // Check if name and comments are defined before calling the mutation
      if (commentBankItem.name && commentBankItem.comments) {
        createCommentBank({
          id: commentBankItem.id,
          name: commentBankItem.name,
          description: commentBankItem.description,
          comments: commentBankItem.comments,
          active: commentBankItem.active,
        });
      } else {
        console.log(commentBankItem, 'TESTING - commentBankItem else');
      }
    });
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
        // @ts-ignore
        onBulkSave={handleBulkSave}
      />
      <AddCommentBank
        initialModalState={commentBank || debouncedCommentBank}
        onClose={() => setCommentBank(null)}
      />
    </PageContainer>
  );
}
