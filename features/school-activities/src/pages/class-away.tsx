import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ActionMenu,
  GridOptions,
  Table,
  useNumber,
  usePreferredNameLayout,
} from '@tyro/core';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, Fade } from '@mui/material';

import { useClassAway, ReturnTypeFromUseClassAway } from '../api/class-away';

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
    valueGetter: ({ data }) => data?.event,
    valueFormatter: ({ data }) => {
      const lessonStartTime = dayjs(data?.event?.startTime).format('HH:mm');
      const lessonEndTime = dayjs(data?.event?.endTime).format('HH:mm');
      return `${lessonStartTime} - ${lessonEndTime}` || '-';
    },
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    enableRowGroup: true,
  },
  {
    headerName: t('schoolActivities:subjectGroup'),
    field: 'event.name',
    valueGetter: ({ data }) => data?.event?.name || '-',
  },
  {
    headerName: t('common:room', { count: 1 }),
    field: 'event.rooms',
    valueGetter: ({ data }) => data?.event?.rooms?.map((room) => room?.name),
  },
  {
    headerName: t('schoolActivities:studentsOnActivity'),
    colId: 'studentsOnActivity',
    valueGetter: ({ data }) => data?.studentsAttendingActivityTotal || '-',
    valueFormatter: ({ data }) => {
      const studentsInGroupTotal = data?.studentsInGroupTotal || 0;
      const studentsAttendingActivityTotal =
        data?.studentsAttendingActivityTotal || 0;
      return `${studentsAttendingActivityTotal}/${studentsInGroupTotal}` || '-';
    },
  },
  {
    headerName: t('common:teacher'),
    field: 'freeStaff',
    valueGetter: ({ data }) => data?.freeStaff || '-',
    valueFormatter: ({ data }) => displayNames(data?.freeStaff),
  },
  // ** NOT SURE WHAT THE FIELD IS TO DISPLAY THIS DATA **
  {
    headerName: 'Windfall',
    colId: 'windfall',
    valueGetter: ({ data }) => data?.event?.lessonInfo?.subjectGroupId || '-',
  },
  {
    headerName: 'Cancelled',
    colId: 'cancelled',
    valueGetter: ({ data }) => data?.event?.lessonInfo?.lessonId || '-',
  },
];

export default function ClassAway() {
  const { t } = useTranslation(['attendance', 'schoolActivities']);
  const { activityId } = useParams();
  const schoolActivityNumber = useNumber(activityId);
  const { displayNames } = usePreferredNameLayout();

  const [selectedRows, setSelectedRows] = useState<
    ReturnTypeFromUseClassAway[]
  >([]);

  const { data: classAwayData, isLoading: isTableLoaded } = useClassAway({
    schoolActivityId: schoolActivityNumber ?? 0,
  });

  const columns = useMemo(() => getColumns(t, displayNames), [t, displayNames]);
  // ** REMOVE ONCE NIALL ADDS BE ** //
  const teacherAvailableForWindfall = true;
  return (
    <Table
      isLoading={isTableLoaded}
      rowData={classAwayData ?? []}
      columnDefs={columns}
      getRowId={({ data }) => String(data?.event?.eventId ?? 0)}
      rightAdornment={
        <Fade in={selectedRows.length > 0} unmountOnExit>
          <Box>
            <ActionMenu
              menuItems={[
                {
                  label: teacherAvailableForWindfall
                    ? 'Set teacher as unavailable'
                    : 'Set teacher as available for windfall',
                  onClick: () => console.log(''),
                  disabled: false,
                },
              ]}
            />
          </Box>
        </Fade>
      }
      onRowSelection={setSelectedRows}
    />
  );
}
