import { useMemo } from 'react';
import { useParams } from 'react-router';
import {
  GridOptions,
  useNumber,
  PageContainer,
  PageHeading,
  Table,
  usePreferredNameLayout,
  BulkEditedRows,
} from '@tyro/core';

import set from 'lodash/set';
import dayjs from 'dayjs';

import { TFunction, useTranslation } from '@tyro/i18n';
import { TableStaffAutocomplete } from '@tyro/people';
import { TableTimetableAutocomplete } from '@tyro/settings';

import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { DaySelector } from '../components/day-selector';
import { PeriodSelector } from '../components/period-selector';
import { useUpdateTimetableLessons } from '../api/update-timetable-lessons';
import {
  useTimetables,
  ReturnTypeFromUseTimetables,
} from '../api/timetable-list';

dayjs.extend(LocalizedFormat);

const weekdays: string[] = Array.from({ length: 5 }, (_, index) =>
  dayjs()
    .day(index + 1)
    .format('dddd')
);

// const getColumnDefs = (
//   t: TFunction<'timetable'[], undefined, 'timetable'[]>,
//   displayNames: ReturnType<typeof usePreferredNameLayout>['displayNames']
// ): GridOptions<ReturnTypeFromUseTimetables>['columnDefs'] => [
//   {
//     headerName: t('timetable:day'),
//     field: 'dayIdx',
//     valueFormatter: ({ data }) => weekdays[Number(data?.dayIdx) - 1] ?? '',
//     valueSetter: ({ data, newValue }) => {
//       set(data ?? {}, 'dayIdx', newValue);
//       return true;
//     },
//     filter: true,
//     editable: true,
//     cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
//     cellEditorSelector: DaySelector(),
//     suppressKeyboardEvent: ({ editing, event }) =>
//       editing && event.key === 'Enter',
//   },
//   {
//     headerName: t('timetable:period'),
//     field: 'periodIdx',
//     valueFormatter: ({ data }) => data?.periodIdx?.toString() ?? '',
//     valueSetter: ({ data, newValue }) => {
//       set(data ?? {}, 'periodIdx', newValue ?? '');
//       return true;
//     },
//     filter: true,
//     editable: true,
//     cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
//     cellEditorSelector: PeriodSelector(),
//     suppressKeyboardEvent: ({ editing, event }) =>
//       editing && event.key === 'Enter',
//   },
//   {
//     headerName: t('timetable:room'),
//     field: 'room',
//     cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
//     valueFormatter: ({ data }) => data?.room?.name ?? '',
//     valueSetter: ({ data, newValue }) => {
//       set(data, 'room', newValue ?? []);
//       return true;
//     },
//     editable: true,
//     cellEditor: TableTimetableAutocomplete,
//     suppressKeyboardEvent: ({ editing, event }) =>
//       editing && event.key === 'Enter',
//   },
//   {
//     headerName: t('timetable:teacher'),
//     field: 'teachers',
//     cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
//     valueFormatter: ({ data }) => displayNames(data?.teachers),
//     valueSetter: ({ data, newValue }) => {
//       set(data, 'teachers', newValue ?? []);
//       return true;
//     },
//     sortable: true,
//     editable: true,
//     cellEditor: TableStaffAutocomplete,
//     suppressKeyboardEvent: ({ editing, event }) =>
//       editing && event.key === 'Enter',
//   },
// ];

export default function Timetables() {
  const { t } = useTranslation(['timetable', 'navigation']);
  const { timetableId } = useParams();
  const timetableIdAsNumber = useNumber(timetableId);
  const { data: timetables } = useTimetables(timetableIdAsNumber ?? 0);
  const { displayNames } = usePreferredNameLayout();
  // const myColumnDefs = useMemo(
  //   () => getColumnDefs(t, displayNames),
  //   [t, displayNames]
  // );

  const { mutateAsync: updateTimetable } = useUpdateTimetableLessons();

  // const handleBulkSave = (
  //   edits: BulkEditedRows<
  //     ReturnTypeFromUseTimetables,
  //     'room' | 'teachers' | 'dayIdx' | 'periodIdx'
  //   >
  // ) => {
  //   const lessonsInstances = Object.entries(edits).map(([key, value]) => {
  //     const { lessonIdx, lessonInstanceIdx, timetableGroupId } = JSON.parse(
  //       key
  //     ) as ReturnTypeFromUseTimetables['id'];

  //     const dayIdx = value?.dayIdx?.newValue ?? null;
  //     const periodIdx = value?.periodIdx?.newValue ?? null;
  //     const roomId = value?.room?.newValue?.roomId ?? null;
  //     const teachersPartyIds =
  //       value?.teachers?.newValue?.map(({ partyId }) => partyId) ?? null;

  //     return {
  //       id: {
  //         lessonIdx,
  //         lessonInstanceIdx,
  //         timetableGroupId,
  //       },
  //       ...(dayIdx ? { dayIdx } : {}),
  //       ...(periodIdx ? { periodIdx } : {}),
  //       ...(roomId ? { roomId } : {}),
  //       ...(teachersPartyIds ? { teachersPartyIds } : {}),
  //     };
  //   });

  //   return updateTimetable({
  //     lessonsInstances,
  //     allowClashes: false,
  //     timetableId: timetableIdAsNumber ?? 0,
  //   });
  // };

  return null;

  // return (
  //   <PageContainer title={t('navigation:general.timetable')}>
  //     <PageHeading
  //       title={t('navigation:general.timetable')}
  //       titleProps={{ variant: 'h3' }}
  //       breadcrumbs={{
  //         links: [
  //           {
  //             name: t('navigation:general.timetable'),
  //             href: './..',
  //           },
  //           {
  //             name: String(timetableId),
  //           },
  //         ],
  //       }}
  //     />
  //     <Table
  //       rowData={timetables ?? []}
  //       columnDefs={myColumnDefs}
  //       rowSelection="multiple"
  //       getRowId={({ data }) => JSON.stringify(data?.id)}
  //       onBulkSave={handleBulkSave}
  //     />
  //   </PageContainer>
  // );
}
