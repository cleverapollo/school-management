import { useEffect, useMemo, useState } from 'react';
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { TtSwapTeacherFilter } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import {
  LoadingPlaceholder,
  TablePersonAvatar,
  usePreferredNameLayout,
} from '@tyro/core';
import {
  LessonChangeState,
  ReturnTypeOfUseSwapTeacherAndRoom,
} from '../../../hooks/use-swap-teacher-and-room-modal';
import { useAvailableTeachersForResource } from '../../../api/edit-timetable/available-resource-options';
import { SwapStyledTable } from './table-style';
import { SwapButton, UndoSwapButton } from './swap-button';
import { StatusChip } from './status-chip';
import {
  getFixedRowStyles,
  TableHeaderRow,
  TABLE_HEADER_ROW_HEIGHT,
} from './common-table-elements';

interface TeacherSwapTableProps {
  isOpen: boolean;
  filter: TtSwapTeacherFilter;
  swapTeacher: ReturnTypeOfUseSwapTeacherAndRoom['swapTeacher'];
  changeState: ReturnTypeOfUseSwapTeacherAndRoom['changeState'];
  searchValue: string;
}

const ROW_HEIGHT = 68;

export function TeacherSwapTable({
  isOpen,
  filter,
  swapTeacher,
  changeState,
  searchValue,
}: TeacherSwapTableProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const { displayName } = usePreferredNameLayout();
  const { data: availableTeachers, isLoading } =
    useAvailableTeachersForResource(isOpen, filter);
  const [hoveredLessonChangeState, setHoveredLessonChangeState] = useState<
    LessonChangeState | undefined
  >(changeState[0]);

  const hoveredLessonIndex = useMemo(
    () =>
      changeState.findIndex(({ id }) => id === hoveredLessonChangeState?.id),
    [changeState, hoveredLessonChangeState]
  );
  const teacherIdsOfHoveredLesson = useMemo(
    () =>
      hoveredLessonChangeState?.teachers.map(({ person }) => person.partyId) ??
      [],
    [hoveredLessonChangeState]
  );

  const filteredTeachers = useMemo(
    () =>
      availableTeachers?.teachers
        .filter(
          ({ teacher: { person } }) =>
            teacherIdsOfHoveredLesson?.includes(person.partyId) ||
            displayName(person)
              .toLowerCase()
              .includes(searchValue.toLowerCase())
        )
        .sort(
          (
            { teacher: { person: personA } },
            { teacher: { person: personB } }
          ) => {
            const aIsTeacher = teacherIdsOfHoveredLesson?.includes(
              personA.partyId
            );
            const bIsTeacher = teacherIdsOfHoveredLesson?.includes(
              personB.partyId
            );

            if (aIsTeacher && !bIsTeacher) {
              return -1;
            }

            if (!aIsTeacher && bIsTeacher) {
              return 1;
            }

            const nameA = displayName(personA);
            const nameB = displayName(personB);

            return nameA.localeCompare(nameB);
          }
        ) ?? [],
    [searchValue, availableTeachers?.teachers, teacherIdsOfHoveredLesson]
  );

  useEffect(() => {
    if (!hoveredLessonChangeState && changeState.length > 0) {
      setHoveredLessonChangeState(changeState[0]);
    }
  }, [changeState]);

  if (isLoading || changeState.length === 0) {
    return <LoadingPlaceholder />;
  }

  return (
    <SwapStyledTable stickyHeader size="small">
      <TableHead>
        <TableHeaderRow
          changeState={changeState}
          firstRowLabel={t('timetable:teachersAvailable')}
        />
      </TableHead>
      <TableBody
        sx={getFixedRowStyles(
          hoveredLessonIndex + 2,
          teacherIdsOfHoveredLesson.length
        )}
      >
        {filteredTeachers.map(
          ({ staffId, teacher, lessonOnTimeslots }, teacherIndex) => {
            const isCurrentTeacher =
              teacherIdsOfHoveredLesson.includes(staffId);
            const stickyTop =
              TABLE_HEADER_ROW_HEIGHT + teacherIndex * ROW_HEIGHT;

            return (
              <TableRow
                className={isCurrentTeacher ? 'fixed-row' : undefined}
                key={staffId}
                sx={{
                  ...(isCurrentTeacher && {
                    top: stickyTop,
                  }),
                }}
              >
                <>
                  <TableCell
                    sx={{
                      '& span': { fontWeight: 600, textWrap: 'nowrap' },
                    }}
                  >
                    <TablePersonAvatar person={teacher.person} />
                  </TableCell>
                  {changeState?.map((lessonChangeState, index) => {
                    const {
                      id,
                      teachers,
                      partyGroup,
                      teacherChangesByLessonId,
                    } = lessonChangeState;
                    const lessonOnTimeslot = lessonOnTimeslots[index] ?? null;
                    const changesForLesson = teacherChangesByLessonId.get(
                      JSON.stringify(id)
                    );
                    const changeForCell = changesForLesson?.find(
                      ({ to, from }) => to.id === staffId || from.id === staffId
                    );
                    const newLessonForCurrentTeacher = Object.values(
                      changeForCell ?? {}
                    ).find((value) => value?.id !== staffId);
                    const isSwapped = Boolean(changeForCell);
                    const isCurrentTeacherForCell = Boolean(
                      teachers.find(({ person }) => person.partyId === staffId)
                    );
                    const setHoveredToCurrentState = () => {
                      if (
                        lessonChangeState.id !== hoveredLessonChangeState?.id
                      ) {
                        setHoveredLessonChangeState(lessonChangeState);
                      }
                    };

                    const fromOptions = teachers
                      .map(({ person }) => ({
                        id: person.partyId,
                        label: displayName(person),
                        isSelected: changeForCell?.from.id === person.partyId,
                        lesson: {
                          id,
                          partyGroup,
                        },
                      }))
                      .sort((a, b) => a.label.localeCompare(b.label));

                    return (
                      <TableCell
                        key={JSON.stringify(id)}
                        onMouseEnter={setHoveredToCurrentState}
                      >
                        {isCurrentTeacherForCell ? (
                          <UndoSwapButton
                            isSwapped={isSwapped}
                            newLesson={newLessonForCurrentTeacher?.lesson}
                            originalLesson={lessonOnTimeslot}
                            onClick={() => {
                              if (changeForCell) {
                                swapTeacher(changeForCell);
                              }
                            }}
                          />
                        ) : (
                          <SwapButton
                            fromOptions={fromOptions}
                            to={{
                              id: staffId,
                              lesson: lessonOnTimeslot,
                            }}
                            onClick={swapTeacher}
                            onFocus={setHoveredToCurrentState}
                            isSwapped={isSwapped}
                          />
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <StatusChip lessons={lessonOnTimeslots} />
                  </TableCell>
                </>
              </TableRow>
            );
          }
        )}
      </TableBody>
    </SwapStyledTable>
  );
}
