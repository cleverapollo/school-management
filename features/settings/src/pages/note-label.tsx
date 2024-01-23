import { Button, Box } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  Table,
  commonActionMenuProps,
} from '@tyro/core';
import { AddIcon, EditIcon, VerticalDotsIcon } from '@tyro/icons';
import { ReturnTypeFromUseNoteTags, useNoteTags } from '@tyro/people';
import {
  UpsertNoteLabelModal,
  UpsertNoteLabelModalProps,
} from '../components/upsert-note-label';

const getNoteTagColumns = (
  onClickEdit: Dispatch<
    SetStateAction<UpsertNoteLabelModalProps['initialState']>
  >,
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromUseNoteTags>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'name',
    lockVisible: true,
    sort: 'asc',
  },
  {
    headerName: t('common:description'),
    field: 'description',
    lockVisible: true,
  },
  {
    headerName: t('settings:noteLabel.code'),
    field: 'tag_l1',
    lockVisible: true,
  },
  {
    ...commonActionMenuProps,
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseNoteTags>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('settings:actions.editNoteLabel'),
              icon: <EditIcon />,
              onClick: () => onClickEdit(data),
            },
          ]}
        />
      ),
  },
];

export default function NoteLabel() {
  const { t } = useTranslation(['common', 'settings']);
  const { data: noteTags = [] } = useNoteTags();

  const [noteLabelDetails, setNoteLabelDetails] =
    useState<UpsertNoteLabelModalProps['initialState']>(null);

  const handleCreateNoteLabel = () => {
    setNoteLabelDetails({});
  };

  const handleCloseEditModal = () => {
    setNoteLabelDetails(null);
  };

  const noteTagColumns = useMemo(
    () => getNoteTagColumns(setNoteLabelDetails, t),
    [noteLabelDetails, t]
  );

  return (
    <PageContainer title={t('settings:noteLabel.title')}>
      <PageHeading
        title={t('settings:noteLabel.title')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={handleCreateNoteLabel}
              startIcon={<AddIcon />}
            >
              {t('settings:actions.addNoteLabel')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={noteTags}
        columnDefs={noteTagColumns}
        getRowId={({ data }) => String(data?.id)}
      />
      <UpsertNoteLabelModal
        noteTags={noteTags}
        initialState={noteLabelDetails}
        onClose={handleCloseEditModal}
      />
    </PageContainer>
  );
}
