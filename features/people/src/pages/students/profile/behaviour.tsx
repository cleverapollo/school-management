import { Box, Button, Chip, Stack } from '@mui/material';
import { getColorBasedOnIndex, usePermissions } from '@tyro/api';
import {
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  getNumber,
  usePreferredNameLayout,
  ActionMenu,
  ConfirmDialog,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { AddIcon, TrashIcon, VerticalDotsIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  ReturnTypeFromUseBehaviours,
  useBehaviours,
} from '../../../api/behaviour/list';
import {
  CreateBehaviourModal,
  CreateBehaviourModalProps,
} from '../../../components/behaviour/create-behaviour-modal';
import { useDeleteBehaviour } from '../../../api/behaviour/delete-behaviour';

dayjs.extend(LocalizedFormat);

const getStudentBehaviourColumns = (
  t: TFunction<('common' | 'people')[]>,
  displayName: ReturnTypeDisplayName,
  onDelete: Dispatch<SetStateAction<ReturnTypeFromUseBehaviours['id']>>
): GridOptions<ReturnTypeFromUseBehaviours>['columnDefs'] => [
  {
    field: 'incidentDate',
    headerName: t('common:date'),
    suppressSizeToFit: true,
    valueGetter: ({ data }) => dayjs(data?.incidentDate).format('ll LT'),
    sort: 'desc',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'associatedGroups',
    headerName: t('common:subjects'),
    autoHeight: true,
    wrapText: true,
    width: 200,
    valueGetter: ({ data }) =>
      data?.associatedGroups?.flatMap((group) => {
        if (group?.__typename === 'SubjectGroup') {
          const [subject] = group.subjects || [];
          return subject?.name;
        }
        return [];
      }),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseBehaviours>) => {
      const subjects = (data?.associatedGroups || []).flatMap((group) => {
        if (group?.__typename === 'SubjectGroup') {
          return { partyId: group.partyId, ...group.subjects[0] };
        }
        return [];
      });

      return subjects.length > 0 ? (
        <Stack gap={1} direction="row" flexWrap="wrap">
          {subjects.map((subject, index) => (
            <Chip
              size="small"
              variant="soft"
              key={subject?.partyId}
              label={subject?.name}
              color={subject?.colour || getColorBasedOnIndex(index)}
            />
          ))}
        </Stack>
      ) : (
        '-'
      );
    },
  },
  {
    field: 'tags',
    headerName: t('people:behaviour'),
    autoHeight: true,
    wrapText: true,
    width: 300,
    valueGetter: ({ data }) => data?.tags[0]?.name || '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseBehaviours>) =>
      (data?.tags || []).length > 0 ? (
        <Stack gap={1} my={1} direction="row" flexWrap="wrap">
          {data?.tags.map(({ id, name }) => (
            <Chip
              key={id}
              label={name}
              variant="soft"
              color={getColorBasedOnIndex(id)}
            />
          ))}
        </Stack>
      ) : (
        '-'
      ),
  },
  {
    field: 'note',
    headerName: t('common:details'),
    autoHeight: true,
    wrapText: true,
    width: 400,
    cellStyle: {
      lineHeight: 2,
      paddingTop: 12,
      paddingBottom: 12,
      wordBreak: 'break-word',
    },
  },
  {
    field: 'createdByPerson',
    suppressSizeToFit: true,
    headerName: t('common:takenBy'),
    valueGetter: ({ data }) => displayName(data?.createdByPerson) || '-',
  },
  {
    suppressColumnsToolPanel: true,
    cellClass: 'ag-show-on-row-interaction',
    sortable: false,
    suppressSizeToFit: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseBehaviours>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('common:actions.delete'),
              icon: <TrashIcon />,
              onClick: () => onDelete(data.id),
            },
          ]}
        />
      ),
  },
];

export default function StudentProfileBehaviourPage() {
  const { t } = useTranslation(['common', 'people']);
  const { isStaffUser } = usePermissions();
  const { displayName } = usePreferredNameLayout();

  const { id } = useParams();
  const studentId = getNumber(id) ?? 0;

  const { data: behaviours = [], isLoading: isBehavioursLoading } =
    useBehaviours(studentId);

  const { mutateAsync: deleteBehaviour } = useDeleteBehaviour(studentId);

  const [behaviourDetails, setBehaviourDetails] =
    useState<CreateBehaviourModalProps['initialState']>();

  const [behaviourIdToDelete, setBehaviourIdToDelete] =
    useState<ReturnTypeFromUseBehaviours['id']>(null);

  const studentBehaviourColumns = useMemo(
    () => getStudentBehaviourColumns(t, displayName, setBehaviourIdToDelete),
    [t, displayName]
  );

  const onConfirmDelete = async () => {
    await deleteBehaviour({ noteIds: [behaviourIdToDelete!] });
  };

  return (
    <>
      {isStaffUser && (
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={() => setBehaviourDetails({})}
            startIcon={<AddIcon />}
          >
            {t('people:actions.createBehaviour')}
          </Button>
        </Box>
      )}

      <Table
        isLoading={isBehavioursLoading}
        rowData={behaviours ?? []}
        columnDefs={studentBehaviourColumns}
        getRowId={({ data }) => String(data?.id)}
      />
      {behaviourDetails && (
        <CreateBehaviourModal
          studentId={studentId}
          onClose={() => setBehaviourDetails(null)}
          initialState={behaviourDetails}
        />
      )}
      {behaviourIdToDelete && (
        <ConfirmDialog
          open
          title={t('people:deleteBehaviour')}
          description={t('people:areYouSureYouWantToDeleteBehaviour')}
          confirmText={t('common:delete')}
          onClose={() => setBehaviourIdToDelete(null)}
          onConfirm={onConfirmDelete}
        />
      )}
    </>
  );
}
