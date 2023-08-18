import { Box, Button, Chip, Stack } from '@mui/material';
import { usePermissions, useUser } from '@tyro/api';
import { GridOptions, Table, useDisclosure } from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  Category,
  CreateBehaviourFormState,
  CreateBehaviourModal,
} from '../../../components/behaviour/create-behaviour-modal';

dayjs.extend(LocalizedFormat);

interface BehaviourDataType {
  id: string;
  behaviour: string;
  details: string;
  subjects: string[];
  category: Category;
  occurredOn: Date;
  createdBy: string;
}

const getStudentBehaviourColumns = (
  t: TFunction<('common' | 'people')[]>
): GridOptions<BehaviourDataType>['columnDefs'] => [
  {
    field: 'behaviour',
    headerName: t('people:behaviour'),
    valueGetter: ({ data }) => data?.behaviour ?? '-',
  },
  {
    field: 'details',
    headerName: t('common:details'),
    valueGetter: ({ data }) => data?.details ?? '-',
  },
  {
    field: 'associated',
    headerName: t('people:associated'),
    cellRenderer: ({ data }: { data: BehaviourDataType }) => (
      <Stack gap={1} direction="row">
        {data.subjects?.map((subject) => (
          <Chip key={subject} label={subject} />
        ))}
      </Stack>
    ),
  },
  {
    field: 'category',
    headerName: t('people:category'),
    valueGetter: ({ data }) => data?.category ?? '-',
  },
  {
    field: 'outcome',
    headerName: t('people:outcome'),
    valueGetter: ({ data }) => data?.behaviour ?? '-',
  },
  {
    field: 'occurredOn',
    headerName: t('people:occurredOn'),
    valueGetter: ({ data }) => dayjs(data?.occurredOn).format('LL'),
  },
  {
    field: 'createdBy',
    headerName: t('common:createdBy'),
    valueGetter: ({ data }) => data?.createdBy ?? '-',
  },
];

export default function StudentProfileBehaviourPage() {
  const { t } = useTranslation(['common', 'people']);
  const { isStaffUser } = usePermissions();
  const { user } = useUser();
  const [behaviours, setBehaviours] = useState<BehaviourDataType[]>([]);

  const studentBehaviourColumns = useMemo(
    () => getStudentBehaviourColumns(t),
    [t]
  );

  const {
    isOpen: isCreateBehaviourModalOpen,
    onOpen: onOpenCreateBehaviourModal,
    onClose: onCloseCreateBehaviourModal,
  } = useDisclosure();

  const handleCreate = (data: CreateBehaviourFormState) => {
    setBehaviours((prevState) => [
      ...prevState,
      { ...data, id: `${Math.random()}`, createdBy: user?.name || '-' },
    ]);
  };

  return (
    <>
      <Table
        rowData={behaviours}
        columnDefs={studentBehaviourColumns}
        getRowId={({ data }) => String(data?.id)}
        rightAdornment={
          isStaffUser && (
            <Box>
              <Button variant="contained" onClick={onOpenCreateBehaviourModal}>
                {t('people:actions.createBehaviour')}
              </Button>
            </Box>
          )
        }
      />
      <CreateBehaviourModal
        isOpen={isCreateBehaviourModalOpen}
        onClose={onCloseCreateBehaviourModal}
        onCreate={handleCreate}
      />
    </>
  );
}
