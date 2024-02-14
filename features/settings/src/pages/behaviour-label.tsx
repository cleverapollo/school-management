import { Box } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ActionMenu,
  BehaviourLabelChip,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  Table,
  commonActionMenuProps,
} from '@tyro/core';
import {
  EditIcon,
  VerticalDotsIcon,
  AddFolderIcon,
  AddIcon,
} from '@tyro/icons';
import {
  ReturnTypeFromUseNoteTagsBehaviour,
  useNoteTagsBehaviour,
} from '@tyro/people';
import {
  UpsertBehaviourLabelModal,
  UpsertBehaviourLabelModalProps,
} from '../components/upsert-behaviour-label';
import { UpsertCategoryModal } from '../components/upsert-category';

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
    sort: 'asc',
  },
  {
    headerName: t('common:description'),
    field: 'description',
  },
  {
    headerName: t('settings:behaviourLabel.reportAs'),
    field: 'behaviourType',
    filter: true,
    filterValueGetter: ({ data }) =>
      data?.behaviourType
        ? t(`common:behaviourType.${data.behaviourType}`)
        : null,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseNoteTagsBehaviour, any>) =>
      data?.behaviourType ? (
        <BehaviourLabelChip behaviourType={data?.behaviourType} />
      ) : null,
  },
  {
    headerName: t('common:category'),
    field: 'behaviourCategory.name',
  },
  {
    ...commonActionMenuProps,
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

  const [noteCategoryDetails, setNoteCategoryDetails] = useState<object | null>(
    null
  );

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
            <Box>
              <ActionMenu
                menuItems={[
                  {
                    label: t('settings:actions.addBehaviourLabel'),
                    icon: <AddIcon />,
                    onClick: () => setNoteLabelDetails({}),
                  },
                  {
                    label: t('settings:actions.addCategory'),
                    icon: <AddFolderIcon />,
                    onClick: () => setNoteCategoryDetails({}),
                  },
                ]}
              />
            </Box>
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
        onClose={() => setNoteLabelDetails(null)}
      />
      <UpsertCategoryModal
        initialState={noteCategoryDetails}
        onClose={() => setNoteCategoryDetails(null)}
      />
    </PageContainer>
  );
}
