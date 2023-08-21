import { Box, Button } from '@mui/material';
import { usePermissions } from '@tyro/api';
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

dayjs.extend(LocalizedFormat);

const getStudentBehaviourColumns = (
  t: TFunction<('common' | 'people')[]>
): GridOptions<ReturnTypeFromUseBehaviours>['columnDefs'] => [
  {
    field: 'behaviour',
    headerName: t('people:behaviour'),
    valueGetter: ({ data }) => data?.note ?? '-',
  },
  {
    field: 'details',
    headerName: t('common:details'),
    valueGetter: ({ data }) => '-',
  },
  {
    field: 'associated',
    headerName: t('people:associated'),
    // cellRenderer: ({ data }: { data: BehaviourDataType }) => (
    //   <Stack gap={1} direction="row">
    //     {data.subjects?.map((subject) => (
    //       <Chip key={subject} label={subject} />
    //     ))}
    //   </Stack>
    // ),
  },
  {
    field: 'category',
    headerName: t('people:category'),
    valueGetter: ({ data }) => '',
  },
  {
    field: 'outcome',
    headerName: t('people:outcome'),
    valueGetter: ({ data }) => '',
  },
  {
    field: 'occurredOn',
    headerName: t('people:occurredOn'),
    valueGetter: ({ data }) => '',
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
  const { isStaffUser } = usePermissions();
  const { data: behaviours = [] } = useBehaviours(studentId);

  const studentBehaviourColumns = useMemo(
    () => getStudentBehaviourColumns(t),
    [t]
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
