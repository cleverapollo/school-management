import { useMemo, useRef, useState } from 'react';
import {
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  Avatar,
  usePreferredNameLayout,
  getLocaleTimestamp,
  ValueSetterParams,
  AgGridReact,
  useDebouncedValue,
  NewValueParams,
  ReturnTypeTableUseEditableState,
  BulkEditedRows,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Chip, Stack, Typography } from '@mui/material';
import set from 'lodash/set';
import {
  ReturnTypeFromCalendarDayBellTimes,
  useCalendarDayBellTimes,
} from '@tyro/calendar';
import {
  AttendanceCodeType,
  SaveStudentSessionAttendanceInput,
  usePermissions,
  UsePermissionsReturn,
} from '@tyro/api';
import {
  ReturnTypeFromSessionAttendance,
  useSaveSessionAttendance,
  useSessionAttendance,
} from '../../api/session-attendance';
import { RolebookToolbar } from './toolbar';
import { RolebookAttendanceValue } from './attendance-value';
import {
  ReturnTypeFromUseAttendanceCodes,
  useAttendanceCodes,
} from '../../api/attendance-codes';
import { AttendanceCodeCellEditor } from './code-cell-editor';
import { NoteModal } from './note-modal';

interface SessionAttendanceRoleBookProps {
  partyIds: number[];
}

const bellColors = ['blue', 'default', 'primary'] as const;

function splitFirstOccurrence(string: string, separator: string) {
  const [first, ...rest] = string.split(separator);

  const remainder = rest.join(separator) || null;

  return [first, remainder];
}

const getColumns = (
  t: TFunction<('common' | 'attendance')[]>,
  displayName: ReturnTypeDisplayName,
  dayBellTimes: ReturnTypeFromCalendarDayBellTimes,
  view: 'icons' | 'codes',
  codeFilterIds: number[],
  attendanceCodesMap: Map<string, ReturnTypeFromUseAttendanceCodes>,
  setNoteRowAndKey: (value: { rowId: string; noteKey: string }) => void,
  { isStaffUserWithPermission }: UsePermissionsReturn
): GridOptions<ReturnTypeFromSessionAttendance>['columnDefs'] => [
  {
    headerName: t('common:student'),
    field: 'student',
    valueGetter: ({ data }) => displayName(data?.student),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromSessionAttendance, any>) => {
      if (!data) return null;

      const name = displayName(data.student);

      return (
        <Box display="flex" alignItems="center">
          <Avatar
            src={data.student?.avatarUrl ?? undefined}
            name={name}
            sx={{
              my: 1,
              mr: 1.5,
            }}
          />
          <Stack>
            <Typography variant="subtitle2">{name}</Typography>
            {data?.classGroup?.name && (
              <Typography variant="caption" color="text.secondary">
                {data.classGroup.name}
              </Typography>
            )}
          </Stack>
        </Box>
      );
    },
    sortable: true,
    pinned: 'left',
    sort: 'asc',
  },
  {
    headerName: t('attendance:uneAbsences'),
    headerTooltip: t('attendance:unexplainedAbsences'),
    field: 'attendanceByKey',
    valueGetter: ({ data }) =>
      Array.from(Object.values(data?.attendanceByKey ?? {})).filter((id) => {
        if (!id) return false;
        const codeType = attendanceCodesMap.get(id)?.codeType;

        return codeType && codeType === AttendanceCodeType.UnexplainedAbsence;
      }).length,
    sortable: true,
  },
  ...dayBellTimes
    .filter(({ bellTimes }) => bellTimes?.length)
    .map(({ date, bellTimes }) => ({
      headerName: dayjs(date).format('ddd D'),
      headerClass: [
        'ag-center-aligned-cell',
        'ag-left-cell-border',
        'ag-right-cell-border',
      ],
      children: bellTimes?.flatMap(({ id, name, time }, index) => {
        const key = `${date}-${id}`;
        const isFirstElement = index === 0;
        const isLastElement = index === bellTimes.length - 1;
        return [
          {
            field: `attendanceByKey.${key}`,
            headerName: name,
            headerComponent: () => (
              <Chip
                size="small"
                color={bellColors[index % bellColors.length]}
                variant="soft"
                label={name}
              />
            ),
            headerTooltip: getLocaleTimestamp(time),
            headerClass: [
              'ag-center-aligned-cell',
              isFirstElement ? 'ag-left-cell-border' : null,
              isLastElement ? 'ag-right-cell-border' : null,
            ],
            width: 100,
            cellStyle: {
              justifyContent: 'center',
            },
            cellClass: [
              isStaffUserWithPermission('ps:1:attendance:write_attendance') &&
                'ag-editable-cell',
              isFirstElement ? 'ag-left-cell-border' : null,
              isLastElement ? 'ag-right-cell-border' : null,
            ],
            cellRenderer: ({
              data,
            }: ICellRendererParams<ReturnTypeFromSessionAttendance, any>) => {
              const codeName = data?.attendanceByKey[key];
              const attendanceCode = attendanceCodesMap.get(codeName ?? '');
              const note = data?.noteByKey[key];

              if (!attendanceCode) return null;
              const { id: codeId, name: code, codeType } = attendanceCode;

              return (
                <RolebookAttendanceValue
                  attendanceCodeType={codeType}
                  code={code}
                  view={view}
                  note={note}
                  includedInFilter={
                    codeFilterIds.length === 0 || codeFilterIds.includes(codeId)
                  }
                />
              );
            },
            valueGetter: ({
              data,
            }: ICellRendererParams<ReturnTypeFromSessionAttendance, any>) => {
              const codeName = data?.attendanceByKey[key];
              const note = data?.noteByKey[key];

              if (!codeName) return null;

              return note ? `${codeName}  ${note}` : codeName;
            },
            valueSetter: ({
              newValue,
              data,
              node,
              isEditCheckCall,
            }: ValueSetterParams<
              ReturnTypeFromSessionAttendance,
              string | null
            >) => {
              if (newValue === 'session-note' && node?.id) {
                setNoteRowAndKey({ rowId: node.id, noteKey: key });
                return false;
              }

              if (!newValue) {
                data.attendanceByKey[key] = null;
                if (!isEditCheckCall) {
                  node?.setDataValue(`noteByKey.${key}`, null);
                }
                return true;
              }

              const [code, note] = splitFirstOccurrence(newValue, '  ');
              const isValidCode = attendanceCodesMap.has(code ?? '');

              if (!isValidCode) return false;

              if (!isEditCheckCall && note) {
                node?.setDataValue(`noteByKey.${key}`, note);
              }
              data.attendanceByKey[key] = code;
              return true;
            },
            cellEditorSelector: AttendanceCodeCellEditor(
              key,
              t,
              Array.from(attendanceCodesMap.values())
            ),
            editable: isStaffUserWithPermission(
              'ps:1:attendance:write_attendance'
            ),
          },
          {
            field: `noteByKey.${key}`,
            headerName: `${name ?? ''} ${t('attendance:note')}`,
            editable: isStaffUserWithPermission(
              'ps:1:attendance:write_attendance'
            ),
            valueSetter: ({
              newValue,
              data,
            }: ValueSetterParams<
              ReturnTypeFromSessionAttendance,
              string | null
            >) => {
              if (!data.noteByKey[key] && !newValue) return false;

              data.noteByKey[key] = !newValue ? null : newValue;
              return true;
            },
            onCellValueChanged: ({
              api,
              node,
            }: NewValueParams<ReturnTypeFromSessionAttendance>) => {
              if (node) {
                api.refreshCells({
                  force: true,
                  rowNodes: [node],
                });
              }
            },
            hide: true,
          },
        ];
      }),
    })),
];

export function SessionAttendanceRoleBook({
  partyIds,
}: SessionAttendanceRoleBookProps) {
  const { t } = useTranslation(['common', 'attendance']);
  const tableRef = useRef<AgGridReact<ReturnTypeFromSessionAttendance>>(null);
  const permissions = usePermissions();
  const editingStateRef =
    useRef<ReturnTypeTableUseEditableState<ReturnTypeFromSessionAttendance>>(
      null
    );
  const { displayName } = usePreferredNameLayout();
  const [view, setView] = useState<'icons' | 'codes'>('icons');
  const [codeFilter, setCodeFilter] = useState<
    ReturnTypeFromUseAttendanceCodes[]
  >([]);
  const {
    value: noteRowAndKey,
    debouncedValue: debouncedNoteRowAndKey,
    setValue: setNoteRowAndKey,
  } = useDebouncedValue<{ rowId: string; noteKey: string } | null>({
    defaultValue: null,
  });
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(1, 'weeks'),
    dayjs(),
  ]);
  const [from, to] = dateRange;
  const fromDate = from.format('YYYY-MM-DD');
  const toDate = to.format('YYYY-MM-DD');

  const codeFilterIds = useMemo(
    () => codeFilter.map(({ id }) => id),
    [codeFilter]
  );

  const { data: bellTimes, isLoading: isBellTimesLoading } =
    useCalendarDayBellTimes({
      fromDate,
      toDate,
    });
  const { data: sessionData, isLoading: isAttendanceLoading } =
    useSessionAttendance({
      partyIds,
      from: fromDate,
      to: toDate,
    });
  const { data: attendanceCodes, isLoading: isAttendanceCodesLoading } =
    useAttendanceCodes({});
  const { mutateAsync: saveSessionAttendance } = useSaveSessionAttendance();

  const attendanceCodesMap = useMemo(
    () =>
      (attendanceCodes ?? []).reduce((acc, attendanceCode) => {
        acc.set(attendanceCode.name, attendanceCode);
        return acc;
      }, new Map<string, ReturnTypeFromUseAttendanceCodes>()),
    [attendanceCodes]
  );

  const columns = useMemo(
    () =>
      getColumns(
        t,
        displayName,
        bellTimes ?? [],
        view,
        codeFilterIds,
        attendanceCodesMap,
        setNoteRowAndKey,
        permissions
      ),
    [
      t,
      displayName,
      bellTimes,
      view,
      codeFilterIds,
      setNoteRowAndKey,
      permissions,
    ]
  );

  const onBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromSessionAttendance,
      'attendanceByKey' | 'noteByKey'
    >
  ) => {
    const attendanceChanges: Record<string, SaveStudentSessionAttendanceInput> =
      {};

    Object.entries(data).forEach(([studentPartyId, changes]) => {
      Object.entries(changes).forEach(([changeKey, value]) => {
        const [key, dateAndBellId] = changeKey.split('.') as [string, string];
        const [year, month, day, bellId] = dateAndBellId.split('-');

        const studentChangeKey = `${studentPartyId}-${dateAndBellId}`;

        if (!attendanceChanges[studentChangeKey]) {
          attendanceChanges[studentChangeKey] = {
            bellTimeId: Number(bellId),
            studentPartyId: Number(studentPartyId),
            date: `${year}-${month}-${day}`,
          };
        }

        const newValue = value.newValue as unknown as string | null;

        if (key === 'attendanceByKey') {
          const attendanceCodeId =
            attendanceCodesMap.get(newValue ?? '')?.id ?? null;
          set(
            attendanceChanges,
            `${studentChangeKey}.attendanceCodeId`,
            attendanceCodeId
          );
        } else if (key === 'noteByKey') {
          set(attendanceChanges, `${studentChangeKey}.note`, newValue);
        }
      });
    });

    return saveSessionAttendance(Object.values(attendanceChanges));
  };

  return (
    <>
      <Table
        ref={tableRef}
        editingStateRef={editingStateRef}
        rowData={sessionData ?? []}
        columnDefs={columns}
        getRowId={({ data }) => String(data?.studentPartyId)}
        isLoading={
          isBellTimesLoading || isAttendanceLoading || isAttendanceCodesLoading
        }
        toolbar={
          <RolebookToolbar
            dateRange={dateRange}
            setDateRange={setDateRange}
            view={view}
            setView={setView}
            codeFilter={codeFilter}
            setCodeFilter={setCodeFilter}
          />
        }
        fillHandleDirection="xy"
        defaultColDef={{
          suppressMovable: true,
          suppressMenu: true,
        }}
        onBulkSave={onBulkSave}
      />
      <NoteModal
        open={!!noteRowAndKey}
        onClose={() => setNoteRowAndKey(null)}
        tableRef={tableRef}
        noteRowAndKey={noteRowAndKey || debouncedNoteRowAndKey}
      />
    </>
  );
}