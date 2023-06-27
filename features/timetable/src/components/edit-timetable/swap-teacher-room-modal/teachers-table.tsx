import { useMemo } from 'react';
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { TtSwapTeacherFilter } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { TablePersonAvatar, usePreferredNameLayout } from '@tyro/core';
import { ReturnTypeOfUseSwapTeacherAndRoom } from '../../../hooks/use-swap-teacher-and-room-modal';
import { useAvailableTeachersForResource } from '../../../api/available-resource-options';
import { SwapStyledTable } from './table-style';
import { SwapButton } from './swap-button';
import { StatusChip } from './status-chip';
import { LoadingPlaceholder } from './loading-placeholder';
import { TableHeaderRow } from './table-header-row';

interface TeacherSwapTableProps {
  isOpen: boolean;
  filter: TtSwapTeacherFilter;
  swapTeacher: ReturnTypeOfUseSwapTeacherAndRoom['swapTeacher'];
  changeState: ReturnTypeOfUseSwapTeacherAndRoom['changeState'];
  searchValue: string;
}

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

  const filteredTeachers = useMemo(
    () =>
      availableTeachers?.teachers.filter(({ teacher }) =>
        displayName(teacher.person).toLowerCase().includes(searchValue)
      ) ?? [],
    [searchValue, availableTeachers?.teachers]
  );

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
      <TableBody>
        {filteredTeachers.map(({ staffId, teacher, lessonOnTimeslots }) => (
          <TableRow key={staffId}>
            <>
              <TableCell
                sx={{ '& span': { fontWeight: 600, textWrap: 'nowrap' } }}
              >
                <TablePersonAvatar person={teacher.person} />
              </TableCell>
              {changeState?.map(
                (
                  { id, teachers, partyGroup, teacherChangesByLessonId },
                  index
                ) => {
                  const lessonOnTimeslot = lessonOnTimeslots[index] ?? null;
                  const changesForLesson = teacherChangesByLessonId.get(
                    JSON.stringify(id)
                  );
                  const changeForCell = changesForLesson?.find(
                    ({ to }) => to.id === staffId
                  );
                  const isSwapped = Boolean(changeForCell);

                  const fromOptions = teachers.map(({ person }) => ({
                    id: person.partyId,
                    label: displayName(person),
                    isSelected: changeForCell?.from.id === person.partyId,
                    lesson: {
                      id,
                      partyGroup,
                    },
                  }));

                  return (
                    <TableCell key={JSON.stringify(id)}>
                      <SwapButton
                        fromOptions={fromOptions}
                        to={{
                          id: staffId,
                          lesson: lessonOnTimeslot,
                        }}
                        onClick={swapTeacher}
                        isSwapped={isSwapped}
                      />
                    </TableCell>
                  );
                }
              )}
              <TableCell>
                <StatusChip lessons={lessonOnTimeslots} />
              </TableCell>
            </>
          </TableRow>
        ))}
      </TableBody>
    </SwapStyledTable>
  );
}
