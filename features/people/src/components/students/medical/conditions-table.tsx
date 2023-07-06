import { Box, Button, Typography } from '@mui/material';
import { UseQueryReturnType } from '@tyro/api';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { AddIcon, TrashIcon, EditIcon, VerticalDotsIcon } from '@tyro/icons';
import { useTranslation, TFunction } from '@tyro/i18n';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  Table,
} from '@tyro/core';
import { useStudentMedical } from '../../../api/student/medical';
import {
  EditConditionsModal,
  EditConditionsProps,
} from './edit-conditions-modal';

type ConditionsTableProps = {
  studentId: number | undefined;
};

export type ReturnTypeFromUseStudentMedical = UseQueryReturnType<
  typeof useStudentMedical
>['conditions'][number];

const getColumns = (
  onClickEdit: Dispatch<
    SetStateAction<EditConditionsProps['initialConditionsState']>
  >,
  t: TFunction<
    ('common' | 'settings' | 'people')[],
    undefined,
    ('common' | 'settings' | 'people')[]
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
    field: 'equipment?.',
  },
  {
    headerName: t('common:location'),
    field: 'location',
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
              label: t('people:editMedicalConditions'),
              icon: <EditIcon />,
              onClick: () => onClickEdit(data),
            },
            {
              label: t('people:deleteMedicalConditions'),
              icon: <TrashIcon />,
              onClick: () => onClickEdit(data),
            },
          ]}
        />
      ),
  },
];

export function ConditionsTable({ studentId }: ConditionsTableProps) {
  const { t } = useTranslation(['common', 'people', 'settings']);
  const { data: medicalData } = useStudentMedical(studentId ?? 0);
  const [editConditions, setEditConditions] =
    useState<EditConditionsProps['initialConditionsState']>(null);

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
    () => getColumns(setEditConditions, t),
    [setEditConditions, t]
  );

  const handleCloseEditModal = () => {
    setEditConditions(null);
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">{t('people:medicalConditions')}</Typography>
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
        conditions={conditions}
        initialConditionsState={editConditions}
        onClose={handleCloseEditModal}
      />
    </>
  );
}
