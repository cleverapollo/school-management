import { Button, Box } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ActionMenu,
  BehaviourLabelChip,
  BehaviourLabelSelectCellEditor,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  Table,
} from '@tyro/core';
import { AddIcon, EditIcon, VerticalDotsIcon } from '@tyro/icons';
import {
  ReturnTypeFromUseNoteTagsBehaviour,
  useNoteTagsBehaviour,
} from '@tyro/people';
import {
  UpsertBehaviourLabelModal,
  UpsertBehaviourLabelModalProps,
} from '../components/upsert-behaviour-label';

const getNoteTagBehaviourColumns = (
  onClickEdit: Dispatch<
    SetStateAction<UpsertBehaviourLabelModalProps['initialState']>
  >,
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromUseNoteTagsBehaviour>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'name',
    lockVisible: true,
    editable: true,
    sort: 'asc',
  },
  {
    headerName: t('common:description'),
    field: 'description',
    lockVisible: true,
  },
  {
    headerName: t('settings:behaviourLabel.reportAs'),
    field: 'behaviourType',
    filter: true,
    editable: true,
    filterValueGetter: ({ data }) =>
      data?.behaviourType
        ? t(`common:behaviourType.${data.behaviourType}`)
        : null,
    cellEditorSelector: BehaviourLabelSelectCellEditor(t),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseNoteTagsBehaviour, any>) =>
      data?.behaviourType ? (
        <BehaviourLabelChip behaviourType={data?.behaviourType} />
      ) : null,
  },
  {
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseNoteTagsBehaviour>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('settings:actions.editBehaviourLabel'),
              icon: <EditIcon />,
              onClick: () => onClickEdit(data),
            },
          ]}
        />
      ),
  },
];

export default function BehaviourLabel() {
  const { t } = useTranslation(['common', 'settings']);
  const { data: noteTags = [] } = useNoteTagsBehaviour();

  const [noteLabelDetails, setNoteLabelDetails] =
    useState<UpsertBehaviourLabelModalProps['initialState']>(null);

  const handleCreateBehaviourLabel = () => {
    setNoteLabelDetails({});
  };

  const handleCloseEditModal = () => {
    setNoteLabelDetails(null);
  };

  const noteTagBehaviourColumns = useMemo(
    () => getNoteTagBehaviourColumns(setNoteLabelDetails, t),
    [noteLabelDetails, t]
  );

  return (
    <PageContainer title={t('settings:behaviourLabel.title')}>
      <PageHeading
        title={t('settings:behaviourLabel.title')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={handleCreateBehaviourLabel}
              startIcon={<AddIcon />}
            >
              {t('settings:actions.addBehaviourLabel')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={noteTags}
        columnDefs={noteTagBehaviourColumns}
        getRowId={({ data }) => String(data?.id)}
      />
      <UpsertBehaviourLabelModal
        initialState={noteLabelDetails}
        onClose={handleCloseEditModal}
      />
    </PageContainer>
  );
}
