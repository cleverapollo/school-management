import { useMemo } from 'react';
import { Stack, CircularProgress } from '@mui/material';
import {
  ICellRendererParams,
  GridOptions,
  Table,
  TablePersonAvatar,
  ReturnTypeDisplayName,
  usePreferredNameLayout,
} from '@tyro/core';
import { useTranslation, TFunction } from '@tyro/i18n';

import { useTableSessionAttendance } from '../../../api/student/attendance/table-session-attendance-view';
import { useStudentDailyCalendarInformation } from '../../../api/student/attendance/daily-calendar-information';

type AttendanceTableViewProps = {
  startDate: string;
  endDate: string;
  studentId: string;
};

type TypeForCombinedAttendanceData = string | null | undefined;
type OptionalTypeForCombinedAttendanceData = string | null;

export type CombinedAttendanceDataType = {
  date: TypeForCombinedAttendanceData;
  type: TypeForCombinedAttendanceData;
  attendanceCode: TypeForCombinedAttendanceData;
  details?: OptionalTypeForCombinedAttendanceData;
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
    sort: 'asc',
  },
  {
    headerName: t('common:type'),
    field: 'type',
    valueGetter: ({ data }) => data?.type,
  },
  {
    headerName: t('common:attendance'),
    field: 'type',
    valueGetter: ({ data }) => data?.attendanceCode,
  },
  {
    headerName: t('common:details'),
    field: 'type',
    valueGetter: ({ data }) => data?.details || '-',
  },
  {
    headerName: t('attendance:takenBy'),
    field: 'createdBy',
    valueGetter: ({ data }) => displayName(data?.createdBy),
    cellRenderer: ({
      data,
    }: ICellRendererParams<CombinedAttendanceDataType, any>) =>
      data?.createdBy?.firstName ? (
        <TablePersonAvatar person={data?.createdBy} />
      ) : (
        '-'
      ),
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
        attendanceCode: eventAttendanceData?.attendanceCode?.name,
        createdBy: eventAttendanceData?.createdBy,
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
    <Stack
      flexDirection={{ xs: 'column', sm: 'row' }}
      flexWrap={{ xs: 'nowrap', sm: 'wrap' }}
      justifyContent={{ xs: 'center', sm: 'space-evenly' }}
      gap={2}
    >
      <Table
        rowData={tableAttendanceData ?? []}
        columnDefs={columns}
        getRowId={({ data }) => String(data?.partyId)}
        sx={{
          boxShadow: 'none',
          p: 0,
          '& .MuiStack-root': { paddingX: 0 },
        }}
      />
    </Stack>
  );
}
