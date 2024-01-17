import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  useNumber,
  usePreferredNameLayout,
  useDebouncedValue,
} from '@tyro/core';

import { TrashIcon, VerticalDotsIcon, EditIcon } from '@tyro/icons';

import {
  ConfirmDeleteBehaviour,
  CreateBehaviourModal,
  CreateBehaviourModalProps,
  ReturnTypeFromUseStudentBehaviour,
  useBehaviourLevelByName,
  useStudentBehaviour,
} from '@tyro/people';
import { Chip, Stack } from '@mui/material';
import { Notes_BehaviourType } from '@tyro/api';

dayjs.extend(LocalizedFormat);

const getSubjectGroupBehaviourColumns = (
  t: TFunction<('common' | 'people')[], undefined, ('common' | 'people')[]>,
  displayName: ReturnTypeDisplayName,
  onClickEdit: Dispatch<
    SetStateAction<CreateBehaviourModalProps['initialState']>
  >,
  onDelete: Dispatch<SetStateAction<number | null>>,
  getBehaviourLevelByName: ReturnType<
    typeof useBehaviourLevelByName
  >['getBehaviourLevelByName']
): GridOptions<ReturnTypeFromUseStudentBehaviour>['columnDefs'] => [
  {
    field: 'incidentDate',
    headerName: t('common:date'),
    valueGetter: ({ data }) => dayjs(data?.incidentDate).format('ll'),
    sort: 'desc',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'category',
    headerName: t('people:category'),
    valueGetter: ({ data }) => data?.category || '-',
  },
  {
    field: 'tags',
    headerName: t('people:tags'),
    autoHeight: true,
    wrapText: true,
    width: 250,
    valueGetter: ({ data }) => data?.tags?.map((tag) => tag?.name) ?? '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentBehaviour>) => {
      const { colour } = getBehaviourLevelByName(data?.category ?? '') ?? {
        colour: 'slate',
      };

      return (
        <Stack gap={1} my={1} direction="row" flexWrap="wrap">
          {data?.tags?.map((tag) => (
            <Chip
              size="small"
              key={tag?.id}
              label={tag?.name}
              variant="soft"
              color={colour ?? 'slate'}
            />
          ))}
        </Stack>
      );
    },
  },
  {
    field: 'details',
    headerName: t('common:details'),
    autoHeight: true,
    wrapText: true,
    width: 250,
    cellStyle: {
      lineHeight: 2,
      paddingTop: 12,
      paddingBottom: 12,
      wordBreak: 'break-word',
    },
  },
  {
    field: 'associatedParties',
    headerName: t('common:students'),
    autoHeight: true,
    wrapText: true,
    width: 200,
    valueGetter: ({ data }) => {
      const subjects = data?.associatedParties?.flatMap((group) => {
        if (group?.__typename === 'SubjectGroup') {
          const [subject] = group.subjects || [];
          return subject?.name;
        }
        return [];
      });

      return subjects && subjects.length > 0 ? subjects.join(', ') : '-';
    },
  },
  {
    field: 'takenBy',
    suppressSizeToFit: true,
    headerName: t('common:createdBy'),
    valueGetter: ({ data }) => displayName(data?.takenBy) || '-',
  },
  {
    suppressColumnsToolPanel: true,
    cellClass: 'ag-show-on-row-interaction',
    sortable: false,
    suppressSizeToFit: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentBehaviour>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('common:actions.delete'),
              icon: <TrashIcon />,
              onClick: () => onDelete(data?.noteId),
            },
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

export default function SubjectGroupProfileBehaviourPage() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const {
    value: editBehaviours,
    setValue: setEditBehaviours,
    debouncedValue: debouncedEditConditions,
  } = useDebouncedValue<CreateBehaviourModalProps['initialState']>({
    defaultValue: null,
  });

  const [behaviourIdToDelete, setBehaviourIdToDelete] = useState<number | null>(
    null
  );

  const { displayName } = usePreferredNameLayout();
  const { getBehaviourLevelByName } = useBehaviourLevelByName();

  const { data: studentBehaviorData, isLoading: isBehavioursLoading } =
    useStudentBehaviour({
      partyId: groupIdNumber ?? 0,
      behaviourType: Notes_BehaviourType.Positive,
    });

  const subjectGroupBehaviourColumns = useMemo(
    () =>
      getSubjectGroupBehaviourColumns(
        t,
        displayName,
        setEditBehaviours,
        setBehaviourIdToDelete,
        getBehaviourLevelByName
      ),
    [
      t,
      displayName,
      setEditBehaviours,
      setBehaviourIdToDelete,
      getBehaviourLevelByName,
    ]
  );

  return (
    <>
      <Table
        isLoading={isBehavioursLoading}
        rowData={studentBehaviorData ?? []}
        columnDefs={subjectGroupBehaviourColumns}
        getRowId={({ data }) => String(data?.noteId)}
      />

      <CreateBehaviourModal
        open={!!editBehaviours}
        onClose={() => setEditBehaviours(null)}
        initialState={editBehaviours || debouncedEditConditions}
      />

      <ConfirmDeleteBehaviour
        idToDelete={behaviourIdToDelete}
        onClose={() => setBehaviourIdToDelete(null)}
      />
    </>
  );
}
