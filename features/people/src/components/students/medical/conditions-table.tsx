import { Box, Button, Typography } from '@mui/material';
import { usePermissions, UseQueryReturnType } from '@tyro/api';
import { Dispatch, SetStateAction, useMemo } from 'react';
import {
  useDebouncedValue,
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  Table,
  commonActionMenuProps,
} from '@tyro/core';
import {
  AddIcon,
  EyeIcon,
  TrashIcon,
  EditIcon,
  VerticalDotsIcon,
} from '@tyro/icons';
import { useTranslation, TFunction } from '@tyro/i18n';
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
    colId: 'location',
    headerName: t('common:location'),
    // For this version of the app, we are only displaying one equipment per condition
    valueGetter: (data) => data?.data?.equipment[0]?.location,
  },
  {
    ...commonActionMenuProps,
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
              hasAccess: ({ isStaffUserWithPermission }) =>
                isStaffUserWithPermission(
                  'ps:1:wellbeing:write_student_medical'
                ),
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
              hasAccess: ({ isStaffUserWithPermission }) =>
                isStaffUserWithPermission(
                  'ps:1:wellbeing:write_student_medical'
                ),
            },
          ]}
        />
      ),
  },
];

export function ConditionsTable({ studentId }: ConditionsTableProps) {
  const { t } = useTranslation(['common', 'people', 'settings']);
  const { data: medicalData } = useStudentMedicalData(studentId ?? 0);
  const permissions = usePermissions();
  const {
    value: editConditions,
    setValue: setEditConditions,
    debouncedValue: debouncedEditConditions,
  } = useDebouncedValue<EditConditionsProps['initialConditionsState']>({
    defaultValue: null,
  });
  const { value: viewConditions, setValue: setViewConditions } =
    useDebouncedValue<ViewConditionsProps['initialConditionsState']>({
      defaultValue: null,
    });
  const { value: deleteConditions, setValue: setDeleteConditions } =
    useDebouncedValue<DeleteConditionsProps['initialConditionsState']>({
      defaultValue: null,
    });

  const handleAddCondition = () => {
    setEditConditions({});
  };

  const conditions = medicalData?.conditions || [];

  const columns = useMemo(
    () =>
      getColumns(setEditConditions, t, setViewConditions, setDeleteConditions),
    [setEditConditions, t, viewConditions, setDeleteConditions]
  );

  return (
    <>
      {permissions.isStaffUserWithPermission(
        'ps:1:wellbeing:write_student_medical'
      ) && (
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
      )}
      <Table
        rowData={conditions}
        columnDefs={columns}
        getRowId={({ data }) => String(data?.id)}
      />
      <EditConditionsModal
        studentId={studentId}
        initialConditionsState={editConditions}
        onClose={() => setEditConditions(null)}
      />
      <ViewConditionsModal
        initialConditionsState={viewConditions}
        onClose={() => setViewConditions(null)}
      />
      <DeleteConditionsModal
        studentId={studentId}
        initialConditionsState={deleteConditions}
        onClose={() => setDeleteConditions(null)}
      />
    </>
  );
}
