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
  BehaviourLabelChip,
  commonActionMenuProps,
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
    valueFormatter: ({ data }) => dayjs(data?.incidentDate).format('lll'),
    sort: 'desc',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    colId: 'type',
    headerName: t('common:type'),
    valueGetter: ({ data }) => {
      const behaviourType = data?.tags?.[0]?.behaviourType;
      return behaviourType ? t(`people:behaviourTypes.${behaviourType}`) : '-';
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentBehaviour, any>) => {
      const behaviourType = data?.tags?.[0]?.behaviourType;

      return behaviourType ? (
        <BehaviourLabelChip behaviourType={behaviourType} />
      ) : null;
    },
    filter: true,
  },
  {
    field: 'category',
    headerName: t('people:category'),
    filter: true,
    valueGetter: ({ data }) => data?.category || '-',
  },
  {
    field: 'tags',
    headerName: t('people:tags'),
    autoHeight: true,
    wrapText: true,
    width: 250,
    filter: true,
    valueGetter: ({ data }) => data?.tags?.map((tag) => tag?.name) ?? '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentBehaviour>) => {
      const { colour } = getBehaviourLevelByName(data?.category ?? '') ?? {
        colour: 'slate',
      };

      if (!data?.tags || data?.tags.length === 0) return '-';

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
    field: 'referencedParties',
    headerName: t('common:students'),
    autoHeight: true,
    wrapText: true,
    width: 300,
    cellStyle: {
      lineHeight: 2,
      paddingTop: 12,
      paddingBottom: 12,
      wordBreak: 'break-word',
    },
    valueGetter: ({ data }) => {
      const students = data?.referencedParties?.map((person) =>
        displayName(person)
      );

      const LIMIT_TAGS = 3;

      if (students && students.length > LIMIT_TAGS) {
        return `${students.slice(0, LIMIT_TAGS).join(', ')}, +${
          students.length - LIMIT_TAGS
        }`;
      }

      return students && students.length > 0 ? students.join(', ') : '-';
    },
  },
  {
    field: 'takenBy',
    suppressSizeToFit: true,
    headerName: t('common:createdBy'),
    valueGetter: ({ data }) => displayName(data?.takenBy) || '-',
  },
  {
    ...commonActionMenuProps,
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
      associatedPartyIds: [groupIdNumber ?? 0],
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
