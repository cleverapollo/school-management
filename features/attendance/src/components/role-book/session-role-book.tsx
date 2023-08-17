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
import {
  ReturnTypeFromCalendarDayBellTimes,
  useCalendarDayBellTimes,
} from '@tyro/calendar';
import {
  AttendanceCodeType,
  SaveStudentSessionAttendanceInput,
} from '@tyro/api';
import {
  ReturnTypeFromSessionAttendance,
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
  setNoteRowAndKey: (value: { rowId: string; noteKey: string }) => void
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
    headerName: t('attendance:absences'),
    field: 'attendanceByKey',
    valueGetter: ({ data }) =>
      Array.from(Object.values(data?.attendanceByKey ?? {})).filter((id) => {
        if (!id) return false;
        const codeType = attendanceCodesMap.get(id)?.codeType;

        return (
          codeType &&
          [
            AttendanceCodeType.ExplainedAbsence,
            AttendanceCodeType.UnexplainedAbsence,
          ].includes(codeType)
        );
      }).length,
    sortable: true,
  },
  ...dayBellTimes
    .filter(({ bellTimes }) => bellTimes?.length)
    .map(({ date, bellTimes }) => ({
      headerName: dayjs(date).format('ddd D'),
      headerClass: 'ag-center-aligned-cell',
      children: bellTimes?.flatMap(({ id, name, time }, index) => {
        const key = `${date}-${id}`;
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
            headerClass: 'ag-center-aligned-cell',
            width: 100,
            cellStyle: {
              justifyContent: 'center',
            },
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
            editable: true,
          },
          {
            field: `noteByKey.${key}`,
            headerName: `${name ?? ''} ${t('attendance:note')}`,
            editable: true,
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

  const { data: bellTimes } = useCalendarDayBellTimes({
    fromDate,
    toDate,
  });
  const { data: sessionData } = useSessionAttendance({
    partyIds,
    from: fromDate,
    to: toDate,
  });
  const { data: attendanceCodes } = useAttendanceCodes({});

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
        setNoteRowAndKey
      ),
    [t, displayName, bellTimes, view, codeFilterIds, setNoteRowAndKey]
  );

  const saveSessionAttendance = (
    data: BulkEditedRows<
      ReturnTypeFromSessionAttendance,
      'attendanceByKey' | 'noteByKey'
    >
  ) => {
    console.log({ data });
    const attendanceChanges: SaveStudentSessionAttendanceInput[] = [];

    Object.values(data).forEach(([studentPartyId, changes]) => {
      console.log({
        studentPartyId,
        changes,
      });
    });

    return new Promise((_resolve, reject) =>
      // console.log({ data });
      reject(new Error('Not implemented'))
    );
  };

  return (
    <>
      <Table
        ref={tableRef}
        editingStateRef={editingStateRef}
        rowData={sessionData ?? []}
        columnDefs={columns}
        getRowId={({ data }) => String(data?.studentPartyId)}
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
        onBulkSave={saveSessionAttendance}
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
