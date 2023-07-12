import { Box, Button, Typography } from '@mui/material';
import { UseQueryReturnType } from '@tyro/api';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  AddIcon,
  EyeIcon,
  TrashIcon,
  EditIcon,
  VerticalDotsIcon,
} from '@tyro/icons';
import { useTranslation, TFunction } from '@tyro/i18n';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  Table,
} from '@tyro/core';
import { useStudentMedicalData } from '../../../api/student/medicals/student-medical-data';
import {
  EditConditionsModal,
  EditConditionsProps,
} from './edit-conditions-modal';
import {
  ViewConditionsModal,
  ViewConditionsProps,
} from './view-conditions-modal';
import {
  DeleteConditionsModal,
  DeleteConditionsProps,
} from './delete-conditions-modal';

export type ConditionsTableProps = {
  studentId: number | undefined;
};

export type ReturnTypeFromUseStudentMedical = UseQueryReturnType<
  typeof useStudentMedicalData
>['conditions'][number];

const getColumns = (
  onClickEdit: Dispatch<
    SetStateAction<EditConditionsProps['initialConditionsState']>
  >,
  t: TFunction<
    ('common' | 'settings' | 'people')[],
    undefined,
    ('common' | 'settings' | 'people')[]
  >,
  onClickView: Dispatch<
    SetStateAction<ViewConditionsProps['initialConditionsState']>
  >,
  onClickDelete: Dispatch<
    SetStateAction<DeleteConditionsProps['initialConditionsState']>
  >
): GridOptions<ReturnTypeFromUseStudentMedical>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'name',
  },
  {
    headerName: t('common:description'),
    field: 'description',
  },
  {
    headerName: t('people:equipment'),
    field: 'equipment',
    // For this version of the app, we are only displaying one equipment per condition
    valueGetter: (data) => data?.data?.equipment[0]?.name,
  },
  {
    headerName: t('common:location'),
    field: 'location',
    // For this version of the app, we are only displaying one equipment per condition
    valueGetter: (data) => data?.data?.equipment[0]?.location,
  },
  {
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentMedical>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('people:editCondition'),
              icon: <EditIcon />,
              onClick: () => onClickEdit(data),
            },
            {
              label: t('people:viewCondition'),
              icon: <EyeIcon />,
              onClick: () => onClickView(data),
            },
            {
              label: t('people:deleteCondition'),
              icon: <TrashIcon />,
              onClick: () => onClickDelete(data),
            },
          ]}
        />
      ),
  },
];

export function ConditionsTable({ studentId }: ConditionsTableProps) {
  const { t } = useTranslation(['common', 'people', 'settings']);
  const { data: medicalData } = useStudentMedicalData(studentId ?? 0);
  const [editConditions, setEditConditions] =
    useState<EditConditionsProps['initialConditionsState']>(null);
  const [viewConditions, setViewConditions] =
    useState<ViewConditionsProps['initialConditionsState']>(null);
  const [deleteConditions, setDeleteConditions] =
    useState<DeleteConditionsProps['initialConditionsState']>(null);

  const handleAddCondition = () => {
    setEditConditions({});
  };

  const conditions = useMemo(() => {
    if (!medicalData?.conditions) {
      return [];
    }
    return medicalData?.conditions;
  }, [medicalData?.conditions]);

  const columns = useMemo(
    () =>
      getColumns(setEditConditions, t, setViewConditions, setDeleteConditions),
    [setEditConditions, t, viewConditions, setDeleteConditions]
  );

  const handleCloseEditModal = () => {
    setEditConditions(null);
  };

  const handleCloseViewModal = () => {
    setViewConditions(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteConditions(null);
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">{t('people:conditions')}</Typography>
        <Button
          variant="contained"
          onClick={handleAddCondition}
          startIcon={<AddIcon />}
        >
          {t('people:addCondition')}
        </Button>
      </Box>
      <Table
        rowData={conditions}
        columnDefs={columns}
        getRowId={({ data }) => String(data?.id)}
      />
      <EditConditionsModal
        studentId={studentId}
        initialConditionsState={editConditions}
        onClose={handleCloseEditModal}
      />
      <ViewConditionsModal
        initialConditionsState={viewConditions}
        onClose={handleCloseViewModal}
      />
      <DeleteConditionsModal
        studentId={studentId}
        initialConditionsState={deleteConditions}
        onClose={handleCloseDeleteModal}
      />
    </>
  );
}
