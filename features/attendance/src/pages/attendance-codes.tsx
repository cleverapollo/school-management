import { TFunction, useTranslation } from '@tyro/i18n';
import {
  Table,
  GridOptions,
  ICellRendererParams,
  ActionMenu,
} from '@tyro/core';
import { Box, Button, Fade, Tabs, Tab } from '@mui/material';
import { AddIcon, VerticalDotsIcon } from '@tyro/icons';
import { AttendanceCodeType, UseQueryReturnType } from '@tyro/api';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useAttendanceCodes } from '../api';
import { TabChipAttendance } from '../components/tab-chip-attendance';
import {
  EditAttendanceCodeModal,
  EditAttendanceCodeViewProps,
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
    lockVisible: true,
  },
  {
    field: 'name',
    headerName: t('attendance:attendanceCodeName'),
  },
  {
    field: 'description',
    headerName: t('common:description'),
  },
  {
    field: 'codeType',
    headerName: t('attendance:reportAs'),
  },
  {
    field: 'visibleForTeacher',
    headerName: t('attendance:availableToTeachers'),
    valueGetter: ({ data }) =>
      data?.visibleForTeacher ? t('common:yes') : t('common:no'),
  },
  {
    field: 'visibleForContact',
    headerName: t('attendance:availableToContacts'),
    valueGetter: ({ data }) =>
      data?.visibleForContact ? t('common:yes') : t('common:no'),
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

export default function AttendanceCodes() {
  const { t } = useTranslation(['common', 'attendance']);
  const { data: attendanceCodes } = useAttendanceCodes({});

  const [editAttendanceCodeInitialState, setEditAttendanceCodeInitialState] =
    useState<EditAttendanceCodeViewProps['initialAttendanceCodeState']>();

  const [tabSelectedCodeType, setTabSelectedCodeType] = useState<string>('ALL');

  const attendanceCodeColumns = useMemo(
    () => getAttendanceCodeColumns(t, setEditAttendanceCodeInitialState),
    [t, setEditAttendanceCodeInitialState]
  );

  const getAttendanceCodesByType = (type: AttendanceCodeType | string) => {
    if (type === 'ALL') return attendanceCodes;
    return attendanceCodes?.filter((item) => item?.codeType === type);
  };

  const tabFilterCodeType = useMemo(
    () => (
      <Tabs
        value={tabSelectedCodeType}
        onChange={(_, value: string) => setTabSelectedCodeType(value)}
      >
        <Tab
          label={
            <TabChipAttendance
              codeType="ALL"
              value={attendanceCodes?.length ?? 0}
              label={t(`attendance:all`)}
            />
          }
          value="ALL"
        />
        {Object.values(AttendanceCodeType).map((item) => {
          const byType = getAttendanceCodesByType(item);
          return (
            <Tab
              label={
                <TabChipAttendance
                  codeType={item}
                  value={byType?.length ?? 0}
                  label={t(`attendance:tabNameByCodeType.${item}`)}
                />
              }
              value={item}
            />
          );
        })}
      </Tabs>
    ),
    [attendanceCodes, tabSelectedCodeType]
  );

  const handleCreateAttendanceCode = () => {
    setEditAttendanceCodeInitialState(
      {} as EditAttendanceCodeViewProps['initialAttendanceCodeState']
    );
  };

  const handleCloseModal = () => {
    setEditAttendanceCodeInitialState(undefined);
  };

  return (
    <>
      <Table
        headerComponent={tabFilterCodeType}
        rowData={getAttendanceCodesByType(tabSelectedCodeType) ?? []}
        columnDefs={attendanceCodeColumns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
        onBulkSave={async () => {}}
        rightAdornment={
          <Fade in unmountOnExit>
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                onClick={handleCreateAttendanceCode}
                startIcon={<AddIcon />}
              >
                {t('attendance:createAttendanceCode')}
              </Button>
            </Box>
          </Fade>
        }
      />
      <EditAttendanceCodeModal
        attendanceCodes={attendanceCodes ?? []}
        initialAttendanceCodeState={editAttendanceCodeInitialState}
        onClose={handleCloseModal}
      />
    </>
  );
}
