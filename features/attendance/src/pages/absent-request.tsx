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
  TuslaCodeSelectCellEditor,
} from '@tyro/core';
import { Box, Button } from '@mui/material';
import { AddIcon, VerticalDotsIcon } from '@tyro/icons';
import { SaveAttendanceCodeInput, TuslaCode } from '@tyro/api';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ReturnTypeFromUseAttendanceCodes,
  useAttendanceCodes,
  useCreateOrUpdateAttendanceCode,
} from '../api';
import {
  EditAttendanceCodeModal,
  EditAttendanceCodeViewProps,
} from '../components/edit-attendance-code-modal';

const tuslaCodes = Object.values(TuslaCode);

const getAttendanceAbsentRequestColumns = (
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
    // headerName: t('attendance:tuslaCode'),
    headerName: 'Avatar',
    editable: true,
    lockVisible: true,
    cellEditorSelector: TuslaCodeSelectCellEditor(),
    onCellValueChanged: (params) => {
      if (
        params.newValue &&
        tuslaCodes.includes(params.newValue as TuslaCode)
      ) {
        params.node?.setDataValue(
          'description',
          t(`attendance:tuslaCodeDescription.${params.newValue as TuslaCode}`)
        );
      }
    },
  },
  {
    field: 'name',
    editable: true,
    headerName: 'Name',
  },
  {
    field: 'description',
    headerName: 'Class',
    editable: ({ data }) => !(data?.code && tuslaCodes.includes(data?.code)),
  },
  {
    field: 'codeType',
    headerName: 'Absent type',
    filter: true,
    editable: true,
    filterValueGetter: ({ data }) =>
      data?.codeType ? t(`common:attendanceCode.${data.codeType}`) : null,
    cellEditorSelector: AttendanceCodeSelectCellEditor(t),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceCodes, any>) =>
      data?.codeType ? <AttendanceCodeChip codeType={data?.codeType} /> : null,
  },
  {
    field: 'visibleForTeacher',
    sort: 'asc',
    headerName: 'Created',
    editable: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceCodes, any>) => (
      <TableBooleanValue value={Boolean(data?.visibleForTeacher)} />
    ),
  },
  {
    field: 'visibleForContact',
    headerName: 'Status',
    editable: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceCodes, any>) => (
      <TableBooleanValue value={Boolean(data?.visibleForContact)} />
    ),
  },
  {
    field: 'visibleForContact',
    headerName: 'View',
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

export default function AbsentRequest() {
  const { t, i18n } = useTranslation(['common', 'attendance']);
  const currentLanguageCode = i18n.language;
  const { data: attendanceCodes } = useAttendanceCodes({});

  const { mutateAsync: saveBulkAttendanceCodes } =
    useCreateOrUpdateAttendanceCode();

  const [editAttendanceCodeInitialState, setEditAttendanceCodeInitialState] =
    useState<EditAttendanceCodeViewProps['initialAttendanceCodeState']>();

  const absentRequestCodeColumns = useMemo(
    () =>
      getAttendanceAbsentRequestColumns(t, setEditAttendanceCodeInitialState),
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
          code: data[id].code?.newValue ?? currentData?.code,
          name: data[id].name?.newValue
            ? [{ locale: currentLanguageCode, value: data[id].name?.newValue }]
            : [{ locale: currentLanguageCode, value: currentData?.name }],
          description: data[id].description?.newValue
            ? [
                {
                  locale: currentLanguageCode,
                  value: data[id].description?.newValue,
                },
              ]
            : [
                {
                  locale: currentLanguageCode,
                  value: currentData?.description,
                },
              ],
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
    <PageContainer title={t('attendance:attendanceCodes')}>
      <PageHeading
        title={t('attendance:attendanceCodes')}
        titleProps={{ variant: 'h3' }}
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
        columnDefs={absentRequestCodeColumns}
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
