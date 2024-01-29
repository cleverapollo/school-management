import { useMemo } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  getLocaleTimestamp,
  GridOptions,
  ICellRendererParams,
  Table,
  useNumber,
  usePreferredNameLayout,
} from '@tyro/core';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { ColorCard } from '@tyro/assessments';
import {
  useLessonsNeedingCover,
  ReturnTypeFromUseLessonsNeedingCover,
} from '../api/lessons-needed-cover';
import { StudentRemainingBar } from '../components/student-remaining-bar';

dayjs.extend(LocalizedFormat);

const getColumns = (
  t: TFunction<
    ('common' | 'schoolActivities')[],
    undefined,
    ('common' | 'schoolActivities')[]
  >,
  displayNames: ReturnType<typeof usePreferredNameLayout>['displayNames']
): GridOptions<ReturnTypeFromUseLessonsNeedingCover>['columnDefs'] => [
  {
    headerName: t('common:time'),
    colId: 'time',
    valueGetter: ({ data }) => {
      const lessonStartTime = getLocaleTimestamp(
        dayjs(data?.event?.startTime).format('HH:mm')
      );
      const lessonEndTime = getLocaleTimestamp(
        dayjs(data?.event?.endTime).format('HH:mm')
      );

      return `${lessonStartTime} - ${lessonEndTime}`;
    },
  },
  {
    headerName: t('schoolActivities:subjectGroup'),
    field: 'event.name',
    valueGetter: ({ data }) => data?.event?.name,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseLessonsNeedingCover>) =>
      data && (
        <ColorCard
          isMobile
          color={data?.event?.colour}
          text={data?.event?.name}
        />
      ),
  },
  {
    headerName: t('common:room', { count: 1 }),
    colId: 'room',
    valueGetter: ({ data }) => data?.event?.rooms[0]?.name || '-',
  },
  {
    headerName: t('common:teacher'),
    field: 'awayStaff',
    valueGetter: ({ data }) =>
      data?.awayStaff ? displayNames(data?.awayStaff) : '-',
  },
  {
    headerName: t('schoolActivities:studentsRemaining'),
    colId: 'studentsRemaining',
    valueGetter: ({ data }) => {
      const studentsInGroupTotal = data?.studentsInGroupTotal || 0;
      const studentsAttendingActivityTotal =
        data?.studentsAttendingActivityTotal || 0;
      return studentsInGroupTotal - studentsAttendingActivityTotal;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseLessonsNeedingCover>) => {
      const studentsInGroupTotal = data?.studentsInGroupTotal || 0;
      const studentsAttendingActivityTotal =
        data?.studentsAttendingActivityTotal || 0;
      const remainingStudents =
        studentsInGroupTotal - studentsAttendingActivityTotal;
      return (
        <StudentRemainingBar
          value={remainingStudents}
          total={data?.studentsInGroupTotal ?? 0}
        />
      );
    },
    sort: 'asc',
  },
];

export default function CoverRequired() {
  const { t } = useTranslation(['attendance', 'schoolActivities']);
  const { activityId } = useParams();
  const schoolActivityNumber = useNumber(activityId);
  const { displayNames } = usePreferredNameLayout();

  const { data: lessonsNeededCover, isLoading: isTableLoaded } =
    useLessonsNeedingCover({
      schoolActivityId: schoolActivityNumber ?? 0,
    });

  const columns = useMemo(() => getColumns(t, displayNames), [t, displayNames]);

  return (
    <Table
      isLoading={isTableLoaded}
      rowData={lessonsNeededCover ?? []}
      columnDefs={columns}
      getRowId={({ data }) =>
        String(data?.event?.calendarEventId?.eventId ?? 0) +
        String(data?.event?.startTime ?? 0)
      }
    />
  );
}
