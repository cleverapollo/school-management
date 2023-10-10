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
import { CalendarParty } from '@tyro/calendar';
import { usePermissions } from '@tyro/api';
import { ReturnTypeFromUseTimetableResourceView } from '../../api/edit-timetable/resource-view';
import { Lesson, useResourceTable } from '../../hooks/use-resource-table';
import { ResourceTableCard } from './resource-table-card';
import { SwapTeacherRoomModal } from './swap-teacher-room-modal';
import { DeleteLessonModal } from './lessons-modals/delete-lesson';
import { AddLessonModal } from './lessons-modals/add-lesson';
import { TimetableContextMenu } from './table-cell-context-menu';
import { Period } from './types';
import { EditLessonModal } from './lessons-modals/edit-lesson';
import { RepublishLessonModal } from './lessons-modals/republish-lesson';

interface ResourcesTableProps {
  timetableId: number;
  resources: ReturnTypeFromUseTimetableResourceView;
  selectedParties: CalendarParty[];
}

export function ResourcesTable({
  timetableId,
  resources,
  selectedParties,
}: ResourcesTableProps) {
  const { t } = useTranslation(['timetable']);
  const [searchValue, setSearchValue] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | {
    el: HTMLElement;
    period: Period;
  }>(null);
  const isContextMenuOpen = Boolean(anchorEl);
  const {
    value: selectLessonsToSwapRoomOrTeacher,
    debouncedValue: debouncedSelectLessonsToSwapRoomOrTeacher,
    setValue: setSelectLessonsToSwapRoomOrTeacher,
  } = useDebouncedValue<Lesson[] | null>({ defaultValue: null });

  const {
    value: selectedLessonToDelete,
    debouncedValue: debouncedSelectedLessonToDelete,
    setValue: setSelectedLessonToDelete,
  } = useDebouncedValue<Lesson | null>({ defaultValue: null });

  const {
    value: selectedLessonToPublish,
    debouncedValue: debouncedSelectedLessonToPublish,
    setValue: setSelectedLessonToPublish,
  } = useDebouncedValue<Lesson[] | null>({ defaultValue: null });

  const {
    value: selectedLessonToEdit,
    debouncedValue: debouncedSelectedLessonToEdit,
    setValue: setSelectedLessonToEdit,
  } = useDebouncedValue<Lesson | null>({ defaultValue: null });

  const {
    value: selectedPeriodToAdd,
    debouncedValue: debouncedSelectedPeriodToAdd,
    setValue: setSelectedPeriodToAdd,
  } = useDebouncedValue<Period | null>({ defaultValue: null });

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

  const onOpenPublishLesson = useCallback(
    (lesson: Lesson) => {
      const lessonId = JSON.stringify(lesson.id);

      const arrayOfUniqueIds = Array.from(
        new Set([...selectedLessonIds, lessonId])
      );
      const lessons = getLessons(arrayOfUniqueIds);
      setSelectedLessonToPublish(lessons);
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
              '& th': {
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
                    const periodObj = {
                      gridIdx: 1,
                      dayIdx: day,
                      periodIdx: period,
                    };
                    return (
                      <TableCell
                        key={period}
                        onContextMenu={(event) => {
                          setAnchorEl({
                            el: event.currentTarget,
                            period: periodObj,
                          });
                          event.stopPropagation();
                          event.preventDefault();
                        }}
                      >
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
                              onOpenDeleteLessonDialog={
                                setSelectedLessonToDelete
                              }
                              onOpenAddLessonDialog={setSelectedPeriodToAdd}
                              onOpenEditLessonDialog={setSelectedLessonToEdit}
                              onOpenPublishLessonDialog={onOpenPublishLesson}
                              period={periodObj}
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
        isOpen={!!selectLessonsToSwapRoomOrTeacher}
        lessons={
          selectLessonsToSwapRoomOrTeacher ??
          debouncedSelectLessonsToSwapRoomOrTeacher
        }
        onClose={() => setSelectLessonsToSwapRoomOrTeacher(null)}
      />
      <DeleteLessonModal
        timetableId={timetableId}
        isOpen={!!selectedLessonToDelete}
        lessons={selectedLessonToDelete ?? debouncedSelectedLessonToDelete}
        onClose={() => setSelectedLessonToDelete(null)}
      />
      <RepublishLessonModal
        timetableId={timetableId}
        isOpen={!!selectedLessonToPublish}
        lessons={selectedLessonToPublish ?? debouncedSelectedLessonToPublish}
        onClose={() => setSelectedLessonToPublish(null)}
      />
      <EditLessonModal
        timetableId={timetableId}
        lesson={selectedLessonToEdit ?? debouncedSelectedLessonToEdit}
        isOpen={!!selectedLessonToEdit}
        onClose={() => setSelectedLessonToEdit(null)}
      />
      <AddLessonModal
        timetableId={timetableId}
        isOpen={!!selectedPeriodToAdd}
        period={selectedPeriodToAdd ?? debouncedSelectedPeriodToAdd}
        selectedParties={selectedParties}
        onClose={() => setSelectedPeriodToAdd(null)}
      />
      <TimetableContextMenu
        anchorEl={anchorEl?.el}
        open={isContextMenuOpen}
        onClose={() => setAnchorEl(null)}
        onOpenAddLessonDialog={() =>
          setSelectedPeriodToAdd(anchorEl?.period ?? null)
        }
        isSelected={isContextMenuOpen}
      />
    </>
  );
}
