import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Container } from '@mui/material';
import {
  GridOptions,
  useNumber,
  Page,
  PageHeading,
  Table,
  usePreferredNameLayout,
  BulkEditedRows,
} from '@tyro/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import set from 'lodash/set';
import { TFunction, useTranslation } from '@tyro/i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TableStaffAutocomplete } from '@tyro/people';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TableTimetableAutocomplete } from '@tyro/settings';
// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import { DaySelector } from '../components/day-selector';
import { PeriodSelector } from '../components/period-selector';
import {
  useTimetables,
  useUpdateTimetableLessons,
  ReturnTypeFromUseTimetables,
} from '../api/timetable';

const getColumnDefs = (
  t: TFunction<'timetable'[], undefined, 'timetable'[]>,
  displayNames: ReturnType<typeof usePreferredNameLayout>['displayNames']
): GridOptions<ReturnTypeFromUseTimetables>['columnDefs'] => [
  {
    headerName: t('timetable:day'),
    field: 'dayIdx',
    valueFormatter: ({ data }) => {
      const weekdays: string[] = Array.from({ length: 5 }, (_, index) =>
        dayjs()
          .day(index + 1)
          .format('dddd')
      );
      const dayId = data?.dayIdx;
      return typeof dayId === 'number' ? weekdays[dayId - 1] : '';
    },
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'dayIdx', newValue);
      return true;
    },
    filter: true,
    editable: true,
    cellClass: 'disable-cell-edit-style',
    cellEditorSelector: DaySelector(),
    suppressKeyboardEvent: ({ editing, event }) =>
      editing && event.key === 'Enter',
  },
  {
    headerName: t('timetable:period'),
    field: 'periodIdx',
    valueFormatter: ({ data }) => data?.periodIdx?.toString() ?? '',
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'periodIdx', newValue ?? '');
      return true;
    },
    filter: true,
    editable: true,
    cellClass: 'disable-cell-edit-style',
    cellEditorSelector: PeriodSelector(),
    suppressKeyboardEvent: ({ editing, event }) =>
      editing && event.key === 'Enter',
  },
  {
    headerName: t('timetable:room'),
    field: 'room',
    cellClass: 'disable-cell-edit-style',
    valueFormatter: ({ data }) => data?.room?.name ?? '',
    valueSetter: ({ data, newValue }) => {
      set(data, 'room', newValue ?? []);
      return true;
    },
    editable: true,
    cellEditor: TableTimetableAutocomplete,
    suppressKeyboardEvent: ({ editing, event }) =>
      editing && event.key === 'Enter',
  },
  {
    headerName: t('timetable:teacher'),
    field: 'teachers',
    cellClass: 'disable-cell-edit-style',
    valueFormatter: ({ data }) => displayNames(data?.teachers),
    valueSetter: ({ data, newValue }) => {
      set(data, 'teachers', newValue ?? []);
      return true;
    },
    sortable: true,
    editable: true,
    cellEditor: TableStaffAutocomplete,
    suppressKeyboardEvent: ({ editing, event }) =>
      editing && event.key === 'Enter',
  },
];

export default function Timetables() {
  const { t } = useTranslation(['timetable', 'navigation']);
  const { timetableId } = useParams();
  const timetableIdAsNumber = useNumber(timetableId);
  const { data: timetables } = useTimetables(timetableIdAsNumber ?? 0);
  const { displayNames } = usePreferredNameLayout();
  const myColumnDefs = useMemo(
    () => getColumnDefs(t, displayNames),
    [t, displayNames]
  );

  const { mutateAsync: updateTimetable } = useUpdateTimetableLessons();

  const handleBulkSave = (
    edits: BulkEditedRows<
      ReturnTypeFromUseTimetables,
      'room' | 'teachers' | 'dayIdx' | 'periodIdx'
    >
  ) => {
    const lessonsInstances = Object.entries(edits).map(([key, value]) => {
      const { lessonIdx, lessonInstanceIdx, timetableGroupId } = JSON.parse(
        key
      ) as ReturnTypeFromUseTimetables['id'];

      const dayIdx = value?.dayIdx?.newValue ?? null;
      const periodIdx = value?.periodIdx?.newValue ?? null;
      const roomId = value?.room?.newValue?.roomId ?? null;
      const teachersPartyIds =
        value?.teachers?.newValue?.map(({ partyId }) => partyId) ?? null;

      return {
        id: {
          lessonIdx,
          lessonInstanceIdx,
          timetableGroupId,
        },
        ...(dayIdx ? { dayIdx } : {}),
        ...(periodIdx ? { periodIdx } : {}),
        ...(roomId ? { roomId } : {}),
        ...(teachersPartyIds ? { teachersPartyIds } : {}),
      };
    });

    return updateTimetable({
      lessonsInstances,
      allowClashes: false,
      timetableId: timetableIdAsNumber ?? 0,
    });
  };

  return (
    <Page title={t('navigation:general.timetable')}>
      <Container maxWidth="xl">
        <PageHeading
          title={t('navigation:general.timetable')}
          breadcrumbs={{
            links: [
              {
                name: t('navigation:general.timetable'),
                href: './..',
              },
              {
                name: String(timetableId),
              },
            ],
          }}
        />

        <Table
          rowData={timetables ?? []}
          columnDefs={myColumnDefs}
          rowSelection="multiple"
          getRowId={({ data }) => JSON.stringify(data?.id)}
          onBulkSave={handleBulkSave}
        />
      </Container>
    </Page>
  );
}
