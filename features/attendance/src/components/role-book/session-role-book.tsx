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
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Stack, Typography } from '@mui/material';
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

interface SessionAttendanceRoleBookProps {
  partyIds: number[];
}

const getColumns = (
  t: TFunction<('common' | 'attendance')[]>,
  displayName: ReturnTypeDisplayName,
  dayBellTimes: ReturnTypeFromCalendarDayBellTimes,
  view: 'icons' | 'codes'
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
    field: 'attendanceMap',
    valueGetter: ({ data }) =>
      Array.from(data?.attendanceMap?.values?.() ?? []).filter(({ codeType }) =>
        [
          AttendanceCodeType.ExplainedAbsence,
          AttendanceCodeType.UnexplainedAbsence,
        ].includes(codeType)
      ).length,
    sortable: true,
  },
  ...dayBellTimes
    .filter(({ bellTimes }) => bellTimes?.length)
    .map(({ date, bellTimes }) => ({
      headerName: dayjs(date).format('ddd D'),
      headerClass: 'ag-center-aligned-cell',
      children: bellTimes?.map(({ id, name, time }) => ({
        headerName: name,
        headerTooltip: getLocaleTimestamp(time),
        headerClass: 'ag-center-aligned-cell',
        cellStyle: {
          justifyContent: 'center',
        },
        cellRenderer: ({
          data,
        }: ICellRendererParams<ReturnTypeFromSessionAttendance, any>) => {
          const attendanceCode = data?.attendanceMap?.get(`${date}-${id}`);

          if (!attendanceCode) return null;

          const { name: code, codeType } = attendanceCode;

          return (
            <RolebookAttendanceValue
              attendanceCodeType={codeType}
              code={code}
              view={view}
              hasNote={false}
            />
          );
        },
        valueGetter: ({
          data,
        }: ValueGetterParams<ReturnTypeFromSessionAttendance>) => {
          const attendanceCode = data?.attendanceMap?.get(`${date}-${id}`);
          return attendanceCode?.name ?? '';
        },
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
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(1, 'weeks'),
    dayjs(),
  ]);
  const [from, to] = dateRange;
  const fromDate = from.format('YYYY-MM-DD');
  const toDate = to.format('YYYY-MM-DD');

  const { data: bellTimes } = useCalendarDayBellTimes({
    fromDate,
    toDate,
  });
  const { data: sessionData } = useSessionAttendance({
    partyIds,
    from: fromDate,
    to: toDate,
  });

  const columns = useMemo(
    () => getColumns(t, displayName, bellTimes ?? [], view),
    [t, displayName, bellTimes, view]
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
