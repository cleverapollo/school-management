import { Box, Button, Chip, Stack } from '@mui/material';
import { getColorBasedOnIndex, usePermissions } from '@tyro/api';
import {
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  getNumber,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { AddIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  ReturnTypeFromUseBehaviours,
  useBehaviours,
} from '../../../api/behaviour/list';
import {
  CreateBehaviourModal,
  CreateBehaviourModalProps,
} from '../../../components/behaviour/create-behaviour-modal';
import {
  ReturnTypeFromUseStudentSubjectGroups,
  useStudentsSubjectGroups,
} from '../../../api/student/overview';

dayjs.extend(LocalizedFormat);

const getStudentBehaviourColumns = (
  t: TFunction<('common' | 'people')[]>,
  subjectGroup: ReturnTypeFromUseStudentSubjectGroups[],
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseBehaviours>['columnDefs'] => [
  {
    field: 'tags',
    headerName: t('people:behaviour'),
    valueGetter: ({ data }) => data?.tags[0]?.name || '-',
  },
  {
    field: 'note',
    headerName: t('common:details'),
    valueGetter: ({ data }) => data?.note || '-',
  },
  {
    colId: 'associated',
    headerName: t('common:associated'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseBehaviours>) => (
      <Stack gap={1} direction="row">
        {data?.associatedGroups?.map((subject, index) => {
          const group = subjectGroup.find(
            (item) => item.partyId === subject?.partyId
          );

          return (
            <Chip
              key={subject?.partyId}
              label={group?.subjects[0]?.name}
              color={group?.subjects[0]?.colour || getColorBasedOnIndex(index)}
            />
          );
        })}
      </Stack>
    ),
  },
  {
    field: 'createdOn',
    headerName: t('common:occurredOn'),
    valueGetter: ({ data }) => dayjs(data?.createdOn).format('LL'),
  },
  {
    field: 'createdByPerson',
    headerName: t('common:createdBy'),
    valueGetter: ({ data }) =>
      data ? displayName(data.createdByPerson) : null,
  },
];

export default function StudentProfileBehaviourPage() {
  const { id } = useParams();
  const studentId = getNumber(id);
  const [behaviourDetails, setBehaviourDetails] =
    useState<CreateBehaviourModalProps['initialState']>();
  const { t } = useTranslation(['common', 'people']);
  const { data: subjectGroup = [], isLoading: isSubjectGroupLoading } =
    useStudentsSubjectGroups(studentId);
  const { isStaffUser } = usePermissions();
  const { displayName } = usePreferredNameLayout();
  const { data: behaviours = [], isLoading: isBehavioursLoading } =
    useBehaviours(studentId);

  const studentBehaviourColumns = useMemo(
    () => getStudentBehaviourColumns(t, subjectGroup, displayName),
    [t, subjectGroup, displayName]
  );

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
        isLoading={isBehavioursLoading || isSubjectGroupLoading}
        rowData={behaviours ?? []}
        columnDefs={studentBehaviourColumns}
        getRowId={({ data }) => String(data?.id)}
      />
      {behaviourDetails && (
        <CreateBehaviourModal
          studentId={studentId!}
          onClose={() => setBehaviourDetails(null)}
          initialState={behaviourDetails}
        />
      )}
    </>
  );
}
