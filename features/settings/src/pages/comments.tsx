import { Button, Box } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useMemo } from 'react';
import {
  BulkEditedRows,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  Table,
  TableSelect,
  TableSwitch,
  useNumber,
  useDebouncedValue,
} from '@tyro/core';
import { AddIcon } from '@tyro/icons';
import set from 'lodash/set';
import { useParams } from 'react-router-dom';
import {
  useCommentBanks,
  ReturnTypeFromCommentBanks,
} from '../api/comment-banks/comment-banks';
import {
  useCommentBankById,
  ReturnTypeFromCommentBankById,
} from '../api/comment-banks/comment';
import {
  AddComment,
  AddCommentProps,
} from '../components/comment-bank/add-comment';

const getCommentsColumns = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromCommentBankById>['columnDefs'] => [
  {
    headerName: t('settings:commentBanks.comment'),
    field: 'comment',
    editable: true,
    cellEditor: 'agCellEditor',
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'comment', newValue);
      return true;
    },
  },
  {
    headerName: t('settings:commentBanks.status'),
    field: 'active',
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'active', newValue);
      return true;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromCommentBankById, any>) =>
      data?.active ? 'Active' : 'Archived',
    cellEditorSelector: ({ data }) => {
      const options = [
        { label: t('settings:active'), value: true },
        { label: t('settings:commentBanks.archived'), value: false },
      ];
      if (data) {
        return {
          component: TableSelect<(typeof options)[number]>,
          popup: true,
          popupPosition: 'under',
          params: {
            options,
            optionIdKey: 'value',
            getOptionLabel: (option: (typeof options)[number]) => option?.label,
          },
        };
      }
    },
  },
];

export default function Comments() {
  const { t } = useTranslation(['common', 'navigation', 'settings']);
  const { id } = useParams();
  const idNumber = useNumber(id);

  const { data: commentBanks = [] } = useCommentBanks({ ids: [idNumber ?? 0] });
  const { data: comments } = useCommentBankById({ ids: [idNumber ?? 0] });

  const {
    value: commentBankComment,
    debouncedValue: debouncedCommentBankComment,
    setValue: setCommentBankComment,
  } = useDebouncedValue<AddCommentProps['initialModalState']>({
    defaultValue: null,
  });

  const handleAddCondition = () => {
    setCommentBankComment({});
  };

  const getColumns = useMemo(() => getCommentsColumns(t), [t]);

  const handleBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromCommentBankById,
      'id' | 'active' | 'comment'
    >
  ) => {
    if (commentBanks) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const commentBankData: ReturnTypeFromCommentBanks[] = JSON.parse(
        JSON.stringify(commentBanks)
      );
      // Loop through edited data
    }
  };

  return (
    <PageContainer title={t('settings:commentBanks.comments')}>
      <PageHeading
        title={t('settings:commentBanks.comments')}
        breadcrumbs={{
          links: [
            {
              name: t('settings:commentBanks.commentBanks'),
              href: './..',
            },
            {
              name: 'Test',
            },
          ],
        }}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={handleAddCondition}
              startIcon={<AddIcon />}
            >
              {t('settings:commentBanks.addComment')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={comments || []}
        columnDefs={getColumns}
        getRowId={({ data }) => String(data?.id)}
        // @ts-ignore
        onBulkSave={handleBulkSave}
      />
      <AddComment
        initialModalState={commentBankComment || debouncedCommentBankComment}
        onClose={() => setCommentBankComment(null)}
        commentBanks={commentBanks ?? []}
      />
    </PageContainer>
  );
}
