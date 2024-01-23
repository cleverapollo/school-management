import { TFunction, useTranslation } from '@tyro/i18n';
import {
  Table,
  GridOptions,
  ICellRendererParams,
  ActionMenu,
  PageContainer,
  PageHeading,
  TuslaCodeSelectCellEditor,
  BulkEditedRows,
  commonActionMenuProps,
} from '@tyro/core';
import { Box, Button } from '@mui/material';
import { AddIcon, VerticalDotsIcon } from '@tyro/icons';
import { Swm_UpsertStaffAbsenceType } from '@tyro/api';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ReturnTypeFromUseAbsenceTypes,
  useStaffWorkAbsenceTypes,
  useCreateOrUpdateAbsenceType,
} from '../api/staff-work-absence-types';
import {
  EditAbsenceTypeModal,
  EditAbsenceTypeModalProps,
} from '../components/absence-types/edit-absence-type-modal';

const getAbsenceCodeColumns = (
  t: TFunction<('common' | 'absence')[]>,
  onClickEdit: Dispatch<
    SetStateAction<EditAbsenceTypeModalProps['initialAbsenceTypeState']>
  >
): GridOptions<ReturnTypeFromUseAbsenceTypes>['columnDefs'] => [
  {
    field: 'code',
    headerName: t('absence:absenceCode'),
    sort: 'asc',
    editable: true,
    lockVisible: true,
    cellEditorSelector: TuslaCodeSelectCellEditor(),
  },
  {
    field: 'name',
    editable: true,
    headerName: t('absence:absenceTypeName'),
  },
  {
    field: 'description',
    headerName: t('common:description'),
    editable: true,
  },
  {
    ...commonActionMenuProps,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAbsenceTypes>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('absence:editAbsenceType'),
              onClick: () => onClickEdit(data),
            },
          ]}
        />
      ),
  },
];

export default function AbsenceTypes() {
  const { t, i18n } = useTranslation(['common', 'absence']);
  const currentLanguageCode = i18n.language;

  const { mutateAsync: saveBulkAbsenceType } = useCreateOrUpdateAbsenceType();

  const [editAbsenceTypeInitialState, setEditAbsenceTypeInitialState] =
    useState<EditAbsenceTypeModalProps['initialAbsenceTypeState']>();

  const { data: absenceTypes } = useStaffWorkAbsenceTypes({});

  const absenceTypeColumns = useMemo(
    () => getAbsenceCodeColumns(t, setEditAbsenceTypeInitialState),
    [t, setEditAbsenceTypeInitialState]
  );

  const handleCreateAbsenceType = () => {
    setEditAbsenceTypeInitialState({});
  };

  const handleBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromUseAbsenceTypes,
      'absenceTypeId' | 'name' | 'description' | 'code' | 'availableForRequests'
    >
  ) => {
    const dataForEndpoint = Object.keys(data).map<Swm_UpsertStaffAbsenceType>(
      (id) => {
        const currentData = absenceTypes?.find(
          (item) => item?.absenceTypeId === Number(id)
        );

        return {
          absenceTypeId: Number(id),
          code: data[id].code?.newValue ?? currentData?.code ?? '',
          name: [
            {
              locale: currentLanguageCode,
              value: data[id].name?.newValue ?? currentData?.name,
            },
          ],
          description: [
            {
              locale: currentLanguageCode,
              value: data[id].description?.newValue ?? currentData?.description,
            },
          ],
          availableForRequests: Boolean(
            data[id].availableForRequests?.newValue ??
              currentData?.availableForRequests
          ),
        };
      }
    );
    return saveBulkAbsenceType(dataForEndpoint);
  };

  return (
    <PageContainer title={t('absence:absenceTypes')}>
      <PageHeading
        title={t('absence:absenceTypes')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={handleCreateAbsenceType}
              startIcon={<AddIcon />}
            >
              {t('absence:createAbsenceType')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={absenceTypes ?? []}
        columnDefs={absenceTypeColumns}
        getRowId={({ data }) => String(data?.absenceTypeId)}
        onBulkSave={handleBulkSave}
      />
      <EditAbsenceTypeModal
        absenceTypes={absenceTypes ?? []}
        initialAbsenceTypeState={editAbsenceTypeInitialState}
        onClose={() => setEditAbsenceTypeInitialState(undefined)}
      />
    </PageContainer>
  );
}
