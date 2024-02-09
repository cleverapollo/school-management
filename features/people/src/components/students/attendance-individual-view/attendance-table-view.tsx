import { useMemo } from 'react';
import { Stack, CircularProgress } from '@mui/material';
import {
  ICellRendererParams,
  GridOptions,
  Table,
  TablePersonAvatar,
  ReturnTypeDisplayName,
  usePreferredNameLayout,
  AttendanceCodeChip,
} from '@tyro/core';
import {
  useTableSessionAttendance,
  useStudentDailyCalendarInformation,
} from '@tyro/attendance';
import { useTranslation, TFunction } from '@tyro/i18n';
import { AttendanceCodeType } from '@tyro/api';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

type AttendanceTableViewProps = {
  startDate: string;
  endDate: string;
  studentId: string;
};

type TypeForCombinedAttendanceData = string | null | undefined;
type OptionalTypeForCombinedAttendanceData = string | null;

export type CombinedAttendanceDataType = {
  date: TypeForCombinedAttendanceData;
  time: TypeForCombinedAttendanceData;
  type: TypeForCombinedAttendanceData;
  attendanceCode: TypeForCombinedAttendanceData;
  attendanceCodeType?: AttendanceCodeType;
  details?: OptionalTypeForCombinedAttendanceData;
  updatedBy?: {
    firstName?: OptionalTypeForCombinedAttendanceData;
    lastName?: OptionalTypeForCombinedAttendanceData;
  };
  createdBy?: {
    firstName?: OptionalTypeForCombinedAttendanceData;
    lastName?: OptionalTypeForCombinedAttendanceData;
  };
  partyId: TypeForCombinedAttendanceData;
};

const getColumns = (
  t: TFunction<
    ('common' | 'attendance')[],
    undefined,
    ('common' | 'attendance')[]
  >,
  displayName: ReturnTypeDisplayName
): GridOptions<CombinedAttendanceDataType>['columnDefs'] => [
  {
    headerName: t('common:date'),
    field: 'date',
    valueGetter: ({ data }) => data?.date,
    sort: 'desc',
    sortIndex: 0,
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
    enableRowGroup: true,
  },
  {
    headerName: t('common:time'),
    field: 'time',
    valueGetter: ({ data }) => data?.time,
    valueFormatter: ({ data }) => data?.time || '',
    sort: 'desc',
  },
  {
    headerName: t('common:type'),
    field: 'type',
    valueGetter: ({ data }) => data?.type,
  },
  {
    headerName: t('common:attendance'),
    field: 'attendanceCode',
    valueGetter: ({ data }) => data?.attendanceCode,
    cellRenderer: ({
      data,
    }: ICellRendererParams<CombinedAttendanceDataType, any>) =>
      data?.attendanceCodeType ? (
        <AttendanceCodeChip codeType={data?.attendanceCodeType} />
      ) : null,
  },
  {
    headerName: t('common:details'),
    field: 'type',
    valueGetter: ({ data }) => data?.details || '-',
  },
  {
    headerName: t('attendance:takenBy'),
    field: 'createdBy',
    valueGetter: ({ data }) => displayName(data?.updatedBy || data?.createdBy),

    cellRenderer: ({
      data,
    }: ICellRendererParams<CombinedAttendanceDataType, any>) => {
      const person = data?.updatedBy || data?.createdBy;

      return person?.firstName ? <TablePersonAvatar person={person} /> : '-';
    },
  },
];

export function AttendanceTableView({
  startDate,
  endDate,
  studentId,
}: AttendanceTableViewProps) {
  const { t } = useTranslation(['common', 'attendance']);
  const { displayName } = usePreferredNameLayout();

  const {
    data: sessionAttendance = [],
    isLoading: isSessionAttendanceLoading,
  } = useTableSessionAttendance({
    partyIds: [Number(studentId) ?? 0],
    from: startDate,
    to: endDate,
  });

  const { data: eventAttendance = [], isLoading: isEventAttendanceLoading } =
    useStudentDailyCalendarInformation({
      resources: {
        partyIds: [Number(studentId)],
      },
      startDate,
      endDate,
    });

  const eventAttendanceFormatted = eventAttendance?.reduce<
    CombinedAttendanceDataType[]
  >((acc, event) => {
    if (
      event?.extensions?.eventAttendance &&
      event?.extensions?.eventAttendance?.length > 0
    ) {
      const eventAttendanceData = event?.extensions?.eventAttendance[0];
      const partyId = event?.partyId;

      const formattedData: CombinedAttendanceDataType = {
        type: event?.name,
        date: eventAttendanceData?.date,
        time: dayjs(event?.startTime)?.format('LT'),
        attendanceCode: eventAttendanceData?.attendanceCode?.name,
        attendanceCodeType: eventAttendanceData?.attendanceCode?.codeType,
        createdBy:
          eventAttendanceData?.updatedBy || eventAttendanceData?.createdBy,
        details: eventAttendanceData?.note,
        partyId,
      };
      acc.push(formattedData);
      return acc;
    }
    return acc;
  }, []);

  const isTimetableLoading =
    isEventAttendanceLoading || isSessionAttendanceLoading;

  const tableAttendanceData: CombinedAttendanceDataType[] = [
    ...sessionAttendance,
    ...eventAttendanceFormatted,
  ];

  const columns = useMemo(() => getColumns(t, displayName), [t, displayName]);

  return isTimetableLoading ? (
    <Stack minHeight="40vh" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Stack>
  ) : (
    <Table
      rowData={tableAttendanceData ?? []}
      columnDefs={columns}
      getRowId={({ data }) => String(data?.partyId)}
      sx={{
        height: '100%',
        boxShadow: 'none',
        p: 0,
        '& .MuiStack-root': { paddingX: 0 },
      }}
    />
  );
}
