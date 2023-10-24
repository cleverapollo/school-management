import { Button, Box } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { Comment, SaveCommentBankInput } from '@tyro/api';
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
import { useCommentBanks } from '../../api/comment-banks/comment-banks';
import {
  useCommentBankById,
  ReturnTypeFromCommentBankById,
} from '../../api/comment-banks/comment';
import {
  AddComment,
  AddCommentProps,
} from '../../components/comment-bank/add-comment';
import { useCreateCommentBank } from '../../api/comment-banks/save-comment-bank';

const getCommentsColumns = (
  t: TFunction<'settings'[], undefined, 'settings'[]>
): GridOptions<ReturnTypeFromCommentBankById>['columnDefs'] => [
  {
    headerName: t('settings:commentBanks.comment'),
    field: 'comment',
    editable: true,
    cellEditor: 'agCellEditor',
    cellClass: ['ag-editable-cell'],
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'comment', newValue);
      return true;
    },
    sort: 'asc',
  },
  {
    headerName: t('settings:commentBanks.status'),
    field: 'active',
    editable: true,
    cellClass: ['ag-editable-cell'],
    cellEditor: TableSwitch,
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'active', newValue);
      return true;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromCommentBankById, any>) =>
      data?.active ? t('settings:active') : t('settings:commentBanks.archived'),
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
  const { t } = useTranslation(['settings']);
  const { id } = useParams();
  const idNumber = useNumber(id);

  const { data: commentBanks = [] } = useCommentBanks({ ids: [idNumber ?? 0] });
  const { data: comments } = useCommentBankById({ ids: [idNumber ?? 0] });
  const { mutateAsync: createCommentBank } = useCreateCommentBank();

  const {
    value: commentBankComment,
    debouncedValue: debouncedCommentBankComment,
    setValue: setCommentBankComment,
  } = useDebouncedValue<AddCommentProps['initialModalState']>({
    defaultValue: null,
  });

  const commentBankName = (commentBanks && commentBanks[0]?.name) ?? '';

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
    const currentCommentBankComments =
      (commentBanks && commentBanks[0].comments) ?? [];

    const currentCommentBank = commentBanks && commentBanks[0];

    const updatedComments = currentCommentBankComments.map((comment) => {
      const editedData = data[comment.id.toString()];

      if (editedData && editedData.comment) {
        comment.comment = editedData.comment.newValue;
      }
      if (editedData && editedData.active) {
        comment.active = editedData.active.newValue;
      }

      return comment;
    });

    return createCommentBank([
      {
        id: currentCommentBank?.id,
        name: commentBankName,
        description: currentCommentBank?.description,
        active: currentCommentBank?.active,
        comments: updatedComments,
      },
    ]);
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
              name: commentBankName,
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
