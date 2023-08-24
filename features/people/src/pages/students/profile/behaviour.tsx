import { Box, Button, Chip, Stack } from '@mui/material';
import {
  Core_Student_SubjectGroupsQuery,
  getColorBasedOnIndex,
  usePermissions,
} from '@tyro/api';
import { GridOptions, PageHeading, Table, getNumber } from '@tyro/core';
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
import { useStudentsSubjectGroups } from '../../../api/student/overview';

dayjs.extend(LocalizedFormat);

const getStudentBehaviourColumns = (
  t: TFunction<('common' | 'people')[]>,
  subjectGroup: Core_Student_SubjectGroupsQuery['core_students'][number]['subjectGroups']
): GridOptions<ReturnTypeFromUseBehaviours>['columnDefs'] => [
  {
    field: 'behaviour',
    headerName: t('people:behaviour'),
    valueGetter: ({ data }) => data?.tags[0]?.name ?? '-',
  },
  {
    field: 'details',
    headerName: t('common:details'),
    valueGetter: ({ data }) => data?.note ?? '-',
  },
  {
    field: 'associated',
    headerName: t('people:associated'),
    cellRenderer: ({ data }: { data: ReturnTypeFromUseBehaviours }) => (
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
    field: 'occurredOn',
    headerName: t('people:occurredOn'),
    valueGetter: ({ data }) => dayjs(data?.createdOn).format('LL'),
  },
  {
    field: 'createdBy',
    headerName: t('common:createdBy'),
    valueGetter: ({ data }) => data?.createdBy ?? '-',
  },
];

export default function StudentProfileBehaviourPage() {
  const { id } = useParams();
  const studentId = getNumber(id);
  const [behaviourDetails, setBehaviourDetails] =
    useState<CreateBehaviourModalProps['initialState']>();
  const { t } = useTranslation(['common', 'people']);
  const { data: subjectGroup, isLoading: subjectGroupLoading } =
    useStudentsSubjectGroups(studentId);
  const { isStaffUser } = usePermissions();
  const { data: behaviours = [], isLoading: behavioursLoading } =
    useBehaviours(studentId);

  const studentBehaviourColumns = useMemo(
    () => getStudentBehaviourColumns(t, subjectGroup || []),
    [t, subjectGroup]
  );

  return (
    <>
      <PageHeading
        title=""
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          isStaffUser && (
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                onClick={() => setBehaviourDetails({})}
                startIcon={<AddIcon />}
              >
                {t('people:actions.createBehaviour')}
              </Button>
            </Box>
          )
        }
      />
      <Table
        isLoading={behavioursLoading || subjectGroupLoading}
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
