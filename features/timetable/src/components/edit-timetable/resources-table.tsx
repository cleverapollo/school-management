import {
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { SearchInput, useDebouncedValue } from '@tyro/core';
import { useCallback, useState } from 'react';
import { ReturnTypeFromUseTimetableResourceView } from '../../api/resource-view';
import { Lesson, useResourceTable } from '../../hooks/use-resource-table';
import { ResourceTableCard } from './resource-table-card';
import { SwapTeacherRoomModal } from './swap-teacher-room-modal';

interface ResourcesTableProps {
  timetableId: number;
  resources: ReturnTypeFromUseTimetableResourceView;
}

export function ResourcesTable({
  timetableId,
  resources,
}: ResourcesTableProps) {
  const { t } = useTranslation(['timetable']);
  const [searchValue, setSearchValue] = useState('');
  const {
    value: selectLessonsToSwapRoomOrTeacher,
    debouncedValue: debouncedSelectLessonsToSwapRoomOrTeacher,
    setValue: setSelectLessonsToSwapRoomOrTeacher,
  } = useDebouncedValue<Lesson[] | null>({ defaultValue: null });

  const {
    gridIds,
    days,
    periods,
    getResourcesByTimeslotId,
    isLessonSelected,
    toggleLessonSelection,
    selectedLessonIds,
    getLessons,
  } = useResourceTable(resources);

  const onOpenSwapRoomOrTeacher = useCallback(
    (lesson: Lesson) => {
      const lessonId = JSON.stringify(lesson.id);

      const arrayOfUniqueIds = Array.from(
        new Set([...selectedLessonIds, lessonId])
      );
      const lessons = getLessons(arrayOfUniqueIds).sort(
        (
          { timeslotId: timeslotIdA, timeslotInfo: timeslotInfoA },
          { timeslotId: timeslotIdB, timeslotInfo: timeslotInfoB }
        ) => {
          if (timeslotIdA && timeslotIdB) {
            if (timeslotIdA.dayIdx < timeslotIdB.dayIdx) return -1;

            if (timeslotIdA.dayIdx > timeslotIdB.dayIdx) return 1;

            if (timeslotIdA.periodIdx < timeslotIdB.periodIdx) return -1;

            if (timeslotIdA.periodIdx < timeslotIdB.periodIdx) return -1;
          }

          if (timeslotInfoA && timeslotInfoB) {
            if (timeslotInfoA.startTime < timeslotInfoB.endTime) return -1;
            if (timeslotInfoA.startTime > timeslotInfoB.endTime) return 1;
          }

          return 0;
        }
      );
      setSelectLessonsToSwapRoomOrTeacher(lessons);
    },
    [selectedLessonIds, getLessons, setSelectLessonsToSwapRoomOrTeacher]
  );

  return (
    <>
      <Card>
        <Stack direction="row" justifyContent="space-between" spacing={2} p={2}>
          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Stack>
        <TableContainer>
          <Table
            stickyHeader
            sx={({ palette }) => ({
              '& th, & td': {
                border: `1px solid ${palette.divider}`,
                p: 1,
              },
              '& thead th': {
                backgroundColor: 'white',
                color: 'text.primary',
                fontWeight: 600,
                backgroundImage: 'none',
                textAlign: 'center',
              },
              '& tbody td, & tbody th': {
                verticalAlign: 'top',
              },
              borderCollapse: 'collapse',
              'th:first-of-type': {
                position: 'sticky',
                left: 0,
                zIndex: 1,
                backgroundColor: 'white',
              },
              // Remove edge border
              '& th:first-of-type': {
                borderLeft: 'none',
              },
              '& th:last-child, & td:last-child': {
                borderRight: 'none',
              },
              '& tbody tr:last-child td, & tbody tr:last-child th': {
                borderBottom: 'none',
              },
            })}
          >
            <TableHead>
              <TableRow>
                <TableCell />
                {periods.map((period) => (
                  <TableCell key={JSON.stringify(period)}>
                    {t(`timetable:periodNumber`, {
                      number: period,
                    })}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {days.map((day) => (
                <TableRow key={day}>
                  <TableCell component="th" scope="row">
                    {dayjs().set('day', day).format('ddd')}
                  </TableCell>
                  {periods.map((period) => {
                    const resourcesForPeriod = gridIds.reduce<
                      ReturnType<typeof getResourcesByTimeslotId>
                    >(
                      (acc, gridIdx) => [
                        ...acc,
                        ...getResourcesByTimeslotId({
                          gridIdx,
                          dayIdx: day,
                          periodIdx: period,
                        }),
                      ],
                      []
                    );
                    return (
                      <TableCell key={period}>
                        <Stack spacing={1}>
                          {resourcesForPeriod.map((resource) => (
                            <ResourceTableCard
                              key={JSON.stringify(resource.id)}
                              resource={resource}
                              multipleGrids={gridIds.length > 1}
                              searchValue={searchValue}
                              isLessonSelected={isLessonSelected}
                              toggleLessonSelection={toggleLessonSelection}
                              selectedLessonIds={selectedLessonIds}
                              onOpenSwapTeacherOrRoomDialog={
                                onOpenSwapRoomOrTeacher
                              }
                            />
                          ))}
                        </Stack>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <SwapTeacherRoomModal
        timetableId={timetableId}
        isOpen={Boolean(selectLessonsToSwapRoomOrTeacher)}
        lessons={
          selectLessonsToSwapRoomOrTeacher ??
          debouncedSelectLessonsToSwapRoomOrTeacher
        }
        onClose={() => setSelectLessonsToSwapRoomOrTeacher(null)}
      />
    </>
  );
}