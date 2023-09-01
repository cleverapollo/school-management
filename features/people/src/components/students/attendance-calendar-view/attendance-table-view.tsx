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
  showCalendarView: boolean;
};

export type CombinedAttendanceDataType = {
  date: string;
  type: string;
  attendanceCode: string;
  details?: string;
  createdBy?: {
    firstName: string;
    lastName: string;
  };
  partyId: string;
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
    valueGetter: ({ data }) => data?.details,
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
      ) : null,
  },
];

export function AttendanceTableView({
  startDate,
  endDate,
  studentId,
  showCalendarView,
}: AttendanceTableViewProps) {
  const { t } = useTranslation(['common', 'attendance']);
  const { displayName } = usePreferredNameLayout();

  const { data: sessionAttendance } = useTableSessionAttendance({
    partyIds: [Number(studentId) ?? 0],
    from: startDate,
    to: endDate,
  });

  const { data: eventAttendance, isLoading: isTimetableLoading } =
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

      const formattedData = {
        type: event?.name,
        date: eventAttendanceData?.date,
        attendanceCode: eventAttendanceData?.attendanceCode?.name,
        createdBy: eventAttendanceData?.createdBy,
        details: eventAttendanceData?.note,
        partyId,
      };
      acc.push(formattedData as unknown as CombinedAttendanceDataType);
      return acc;
    }
    return acc;
  }, []);

  const tableAttendanceData = sessionAttendance?.concat(
    eventAttendanceFormatted as CombinedAttendanceDataType[]
  ) as CombinedAttendanceDataType[];

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
      sx={{
        '& .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root.css-1c2bdvq-MuiPaper-root-MuiCard-root':
          {
            boxShadow: showCalendarView ? 'none' : 'none',
          },
      }}
      gap={2}
    >
      <Table
        rowData={tableAttendanceData ?? []}
        columnDefs={columns}
        getRowId={({ data }) => String(data?.partyId)}
        sx={{
          boxShadow: 'none',
          p: 0,
          '& .css-15bh6sw-MuiStack-root': { paddingX: 0 },
        }}
      />
    </Stack>
  );
}
