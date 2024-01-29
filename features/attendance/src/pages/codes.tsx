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
  commonActionMenuProps,
  useDebouncedValue,
} from '@tyro/core';
import { Box, Button } from '@mui/material';
import { AddIcon, VerticalDotsIcon } from '@tyro/icons';
import { SaveAttendanceCodeInput, TuslaCode } from '@tyro/api';
import { Dispatch, SetStateAction, useMemo } from 'react';
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
    headerName: t('attendance:attendanceCodeName'),
  },
  {
    field: 'description',
    headerName: t('common:description'),
    editable: ({ data }) => !(data?.code && tuslaCodes.includes(data?.code)),
  },
  {
    field: 'sessionCodeType',
    headerName: t('attendance:reportAs'),
    filter: true,
    editable: true,
    filterValueGetter: ({ data }) =>
      data?.sessionCodeType
        ? t(`common:attendanceCode.${data.sessionCodeType}`)
        : null,
    cellEditorSelector: AttendanceCodeSelectCellEditor(t),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceCodes, any>) =>
      data?.sessionCodeType ? (
        <AttendanceCodeChip codeType={data?.sessionCodeType} />
      ) : null,
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
    field: 'active',
    headerName: t('common:active'),
    editable: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceCodes, any>) => (
      <TableBooleanValue value={Boolean(data?.active)} />
    ),
  },
  {
    ...commonActionMenuProps,
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
              disabled: !data?.custom,
              disabledTooltip: t('attendance:editAttendanceCodeTooltip'),
            },
          ]}
        />
      ),
  },
];

export default function Codes() {
  const { t, i18n } = useTranslation(['common', 'attendance']);
  const currentLanguageCode = i18n.language;
  const { data: attendanceCodes } = useAttendanceCodes({});

  const { mutateAsync: saveBulkAttendanceCodes } =
    useCreateOrUpdateAttendanceCode();

  const {
    value: editAttendanceCodeInitialState,
    debouncedValue: debouncedEditAttendanceCodeInitialState,
    setValue: setEditAttendanceCodeInitialState,
  } = useDebouncedValue<
    EditAttendanceCodeViewProps['initialAttendanceCodeState']
  >({
    defaultValue: null,
  });

  const attendanceCodeColumns = useMemo(
    () => getAttendanceCodeColumns(t, setEditAttendanceCodeInitialState),
    [t, setEditAttendanceCodeInitialState]
  );

  const handleCreateAttendanceCode = () => {
    setEditAttendanceCodeInitialState(
      {} as EditAttendanceCodeViewProps['initialAttendanceCodeState']
    );
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
          codeType: data[id].codeType?.newValue ?? currentData?.sessionCodeType,
          visibleForTeacher:
            data[id].visibleForTeacher?.newValue ??
            currentData?.visibleForTeacher,
          visibleForContact:
            data[id].visibleForContact?.newValue ??
            currentData?.visibleForContact,
          nameTextId: currentData?.nameTextId,
          isActive: currentData?.active,
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
        columnDefs={attendanceCodeColumns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
        onBulkSave={handleBulkSave}
      />
      <EditAttendanceCodeModal
        attendanceCodes={attendanceCodes ?? []}
        initialAttendanceCodeState={
          editAttendanceCodeInitialState ||
          debouncedEditAttendanceCodeInitialState
        }
        onClose={() => setEditAttendanceCodeInitialState(null)}
      />
    </PageContainer>
  );
}
