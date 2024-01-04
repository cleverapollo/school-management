import { useMemo } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  getLocaleTimestamp,
  GridOptions,
  ICellRendererParams,
  Table,
  TableBooleanValue,
  TableSwitch,
  useNumber,
  usePreferredNameLayout,
} from '@tyro/core';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { ColorCard } from '@tyro/assessments';

import { useClassAway, ReturnTypeFromUseClassAway } from '../api/class-away';
import { StudentRemainingBar } from '../components/student-remaining-bar';

dayjs.extend(LocalizedFormat);

const getColumns = (
  t: TFunction<
    ('common' | 'schoolActivities')[],
    undefined,
    ('common' | 'schoolActivities')[]
  >,
  displayNames: ReturnType<typeof usePreferredNameLayout>['displayNames']
): GridOptions<ReturnTypeFromUseClassAway>['columnDefs'] => [
  {
    headerName: t('common:time'),
    field: 'event',
    valueGetter: ({ data }) => {
      const lessonStartTime = getLocaleTimestamp(
        dayjs(data?.event?.startTime).format('HH:mm')
      );
      const lessonEndTime = getLocaleTimestamp(
        dayjs(data?.event?.endTime).format('HH:mm')
      );
      return `${lessonStartTime} - ${lessonEndTime}` || '-';
    },
  },
  {
    headerName: t('schoolActivities:subjectGroup'),
    field: 'event.name',
    valueGetter: ({ data }) => data?.event?.name || '-',
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseClassAway>) =>
      data && (
        <ColorCard color={data?.event?.colour} text={data?.event?.name} />
      ),
  },
  {
    headerName: t('common:room', { count: 1 }),
    field: 'event.rooms',
    valueGetter: ({ data }) => data?.event?.rooms?.map((room) => room?.name),
  },
  {
    headerName: t('schoolActivities:studentsOnActivity'),
    colId: 'studentsOnActivity',
    valueGetter: ({ data }) => data?.studentsAttendingActivityTotal || 0,
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseClassAway>) =>
      data && (
        <StudentRemainingBar
          value={data?.studentsAttendingActivityTotal}
          total={data?.studentsInGroupTotal}
        />
      ),
    sort: 'asc',
  },
  {
    headerName: t('common:teacher'),
    field: 'freeStaff',
    valueGetter: ({ data }) => displayNames(data?.freeStaff) || '-',
  },
  {
    headerName: t('schoolActivities:windfall'),
    field: 'staffAreFreed',
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueGetter: ({ data }) => data?.staffAreFreed || '-',
    valueFormatter: ({ data }) =>
      data?.staffAreFreed ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseClassAway, any>) => (
      <TableBooleanValue value={Boolean(data?.staffAreFreed)} />
    ),
  },
  {
    headerName: t('schoolActivities:cancelled'),
    field: 'cancelled',
    valueGetter: ({ data }) => data?.cancelled || '-',
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueFormatter: ({ data }) =>
      data?.cancelled ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseClassAway, any>) => (
      <TableBooleanValue value={Boolean(data?.cancelled)} />
    ),
  },
];

export default function ClassAway() {
  const { t } = useTranslation(['attendance', 'schoolActivities']);
  const { activityId } = useParams();
  const schoolActivityNumber = useNumber(activityId);
  const { displayNames } = usePreferredNameLayout();

  const { data: classAwayData, isLoading: isTableLoaded } = useClassAway({
    schoolActivityId: schoolActivityNumber ?? 0,
  });

  const columns = useMemo(() => getColumns(t, displayNames), [t, displayNames]);

  return (
    <Table
      isLoading={isTableLoaded}
      rowData={classAwayData ?? []}
      columnDefs={columns}
      getRowId={({ data }) =>
        String(data?.event?.calendarEventId?.eventId ?? 0) +
        String(data?.event?.startTime ?? 0)
      }
    />
  );
}
