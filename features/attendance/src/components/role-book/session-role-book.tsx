import { useMemo, useState } from 'react';
import {
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  Avatar,
  usePreferredNameLayout,
  getLocaleTimestamp,
  ValueGetterParams,
  ValueSetterParams,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Chip, Stack, Typography } from '@mui/material';
import {
  ReturnTypeFromCalendarDayBellTimes,
  useCalendarDayBellTimes,
} from '@tyro/calendar';
import { AttendanceCodeType } from '@tyro/api';
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

interface SessionAttendanceRoleBookProps {
  partyIds: number[];
}

const bellColors = ['blue', 'default', 'primary'] as const;

const getColumns = (
  t: TFunction<('common' | 'attendance')[]>,
  displayName: ReturnTypeDisplayName,
  dayBellTimes: ReturnTypeFromCalendarDayBellTimes,
  view: 'icons' | 'codes',
  codeFilterIds: number[],
  attendanceCodesMap: Map<string, ReturnTypeFromUseAttendanceCodes>
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
      children: bellTimes?.map(({ id, name, time }, index) => ({
        field: `attendanceByKey.${date}-${id}`,
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
          const codeName = data?.attendanceByKey[`${date}-${id}`];
          const attendanceCode = attendanceCodesMap.get(codeName ?? '');

          if (!attendanceCode) return null;
          const { id: codeId, name: code, codeType } = attendanceCode;

          return (
            <RolebookAttendanceValue
              attendanceCodeType={codeType}
              code={code}
              view={view}
              hasNote={false}
              includedInFilter={
                codeFilterIds.length === 0 || codeFilterIds.includes(codeId)
              }
            />
          );
        },
        // valueSetter: ({
        //   oldValue,
        //   newValue,
        //   data,
        // }: ValueSetterParams<
        //   ReturnTypeFromSessionAttendance,
        //   string | null
        // >) => {
        //   console.log({
        //     oldValue,
        //     newValue,
        //   });
        //   const valueKey = `${date}-${id}`;
        //   const oldValueAttendanceCode = oldValue;
        //   const newValueAttendanceCode =
        //     typeof newValue === 'string'
        //       : newValue;

        //   if (oldValueAttendanceCode?.id !== newValueAttendanceCode?.id) {
        //     if (!newValueAttendanceCode) {
        //       data.attendanceByKey[valueKey] = null;
        //       return true;
        //     }

        //     if (newValueAttendanceCode) {
        //       data.attendanceByKey[valueKey] = newValueAttendanceCode;
        //       return true;
        //     }
        //   }

        //   return false;
        // },
        cellEditorSelector: AttendanceCodeCellEditor(
          Array.from(attendanceCodesMap.values())
        ),
        editable: true,
      })),
    })),
];

export function SessionAttendanceRoleBook({
  partyIds,
}: SessionAttendanceRoleBookProps) {
  const { t } = useTranslation(['common', 'attendance']);
  const { displayName } = usePreferredNameLayout();
  const [view, setView] = useState<'icons' | 'codes'>('icons');
  const [codeFilter, setCodeFilter] = useState<
    ReturnTypeFromUseAttendanceCodes[]
  >([]);
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
        attendanceCodesMap
      ),
    [t, displayName, bellTimes, view, codeFilterIds]
  );

  return (
    <Table
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
    />
  );
}
