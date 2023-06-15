import { TFunction, useTranslation } from '@tyro/i18n';
import {
  Table,
  GridOptions,
  ICellRendererParams,
  ActionMenu,
  AttendanceCodeChip,
  PageContainer,
  PageHeading,
  TableBooleanValue,
  AttendanceCodeSelectCellEditor,
  BulkEditedRows,
} from '@tyro/core';
import { Box, Button } from '@mui/material';
import { AddIcon, VerticalDotsIcon } from '@tyro/icons';
import {
  AttendanceCodeType,
  SaveAttendanceCodeInput,
  UseQueryReturnType,
} from '@tyro/api';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useAttendanceCodes, useBulkUpdateAttendanceCode } from '../api';
import {
  EditAttendanceCodeModal,
  EditAttendanceCodeViewProps,
  codeDescriptionMapping,
} from '../components/edit-attendance-code-modal';

export type ReturnTypeFromUseAttendanceCodes = UseQueryReturnType<
  typeof useAttendanceCodes
>[number];

const getAttendanceCodeColumns = (
  t: TFunction<
    ('common' | 'attendance')[],
    undefined,
    ('attendance' | 'attendance')[]
  >,
  onClickEdit: Dispatch<
    SetStateAction<EditAttendanceCodeViewProps['initialAttendanceCodeState']>
  >
): GridOptions<ReturnTypeFromUseAttendanceCodes>['columnDefs'] => [
  {
    field: 'code',
    headerName: t('attendance:tuslaCode'),
    sort: 'asc',
    editable: true,
    lockVisible: true,
    onCellValueChanged: (params) => {
      const codes = Object.keys(codeDescriptionMapping);
      if (params.newValue && codes.includes(params.newValue as string)) {
        params.node?.setDataValue(
          'description',
          codeDescriptionMapping[
            params.newValue as keyof typeof codeDescriptionMapping
          ]
        );
      }
    },
  },
  {
    field: 'name',
    editable: true,
    headerName: t('attendance:attendanceCodeName'),
  },
  {
    field: 'description',
    headerName: t('common:description'),
    editable: ({ data }) => {
      const codes = Object.keys(codeDescriptionMapping);
      return !(data?.code && codes.includes(data?.code));
    },
  },
  {
    field: 'codeType',
    headerName: t('attendance:reportAs'),
    filter: true,
    editable: true,
    cellEditorSelector: AttendanceCodeSelectCellEditor(t),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceCodes, any>) =>
      data?.codeType ? <AttendanceCodeChip codeType={data?.codeType} /> : null,
  },
  {
    field: 'visibleForTeacher',
    headerName: t('attendance:availableToTeachers'),
    editable: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceCodes, any>) => (
      <TableBooleanValue value={Boolean(data?.visibleForTeacher)} />
    ),
  },
  {
    field: 'visibleForContact',
    headerName: t('attendance:availableToContacts'),
    editable: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceCodes, any>) => (
      <TableBooleanValue value={Boolean(data?.visibleForContact)} />
    ),
  },
  {
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceCodes>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('attendance:editAttendanceCode'),
              onClick: () => onClickEdit(data),
            },
          ]}
        />
      ),
  },
];

export default function Codes() {
  const { t } = useTranslation(['common', 'attendance']);
  const { data: attendanceCodes } = useAttendanceCodes({});

  const { mutateAsync: saveBulkAttendanceCodes } =
    useBulkUpdateAttendanceCode();

  const [editAttendanceCodeInitialState, setEditAttendanceCodeInitialState] =
    useState<EditAttendanceCodeViewProps['initialAttendanceCodeState']>();

  const attendanceCodeColumns = useMemo(
    () => getAttendanceCodeColumns(t, setEditAttendanceCodeInitialState),
    [t, setEditAttendanceCodeInitialState]
  );

  const handleCreateAttendanceCode = () => {
    setEditAttendanceCodeInitialState(
      {} as EditAttendanceCodeViewProps['initialAttendanceCodeState']
    );
  };

  const handleCloseModal = () => {
    setEditAttendanceCodeInitialState(undefined);
  };

  const handleBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromUseAttendanceCodes,
      | 'name'
      | 'code'
      | 'codeType'
      | 'description'
      | 'visibleForTeacher'
      | 'visibleForContact'
    >
  ) => {
    const dataForEndpoint = Object.keys(data).map<SaveAttendanceCodeInput>(
      (id) => {
        const currentData = attendanceCodes?.find(
          (item) => item?.id === Number(id)
        );
        return {
          id: Number(id),
          code:
            data[id].code?.newValue ??
            currentData?.code ??
            AttendanceCodeType.NotTaken,
          name: data[id].name?.newValue
            ? [{ locale: 'en', value: data[id].name?.newValue }]
            : [{ locale: 'en', value: currentData?.name }],
          description: data[id].description?.newValue
            ? [{ locale: 'en', value: data[id].description?.newValue }]
            : [{ locale: 'en', value: currentData?.description }],
          codeType: data[id].codeType?.newValue ?? currentData?.codeType,
          visibleForTeacher:
            data[id].visibleForTeacher?.newValue ??
            currentData?.visibleForTeacher,
          visibleForContact:
            data[id].visibleForContact?.newValue ??
            currentData?.visibleForContact,
          nameTextId: currentData?.nameTextId,
          isActive: true,
        };
      }
    );
    return saveBulkAttendanceCodes(dataForEndpoint);
  };

  return (
    <PageContainer
      title={t('attendance:pageTitle.attendance')}
      maxWidth="xl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <PageHeading
        title={t('attendance:pageHeading.attendance')}
        breadcrumbs={{
          links: [
            {
              name: t('attendance:attendance'),
              href: './..',
            },
            {
              name: t('attendance:attendanceCodes'),
            },
          ],
        }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={handleCreateAttendanceCode}
              startIcon={<AddIcon />}
            >
              {t('attendance:createAttendanceCode')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={attendanceCodes ?? []}
        columnDefs={attendanceCodeColumns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
        onBulkSave={handleBulkSave}
      />
      <EditAttendanceCodeModal
        attendanceCodes={attendanceCodes ?? []}
        initialAttendanceCodeState={editAttendanceCodeInitialState}
        onClose={handleCloseModal}
      />
    </PageContainer>
  );
}
