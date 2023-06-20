import {
  Box,
  CircularProgress,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { TtSwapTeacherFilter } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { TablePersonAvatar, usePreferredNameLayout } from '@tyro/core';
import { ReturnTypeOfUseSwapTeacherAndRoom } from '../../../hooks/use-swap-teacher-and-room';
import { useAvailableTeachersForResource } from '../../../api/available-resource-options';
import { SwapStyledTable } from './table-style';
import { SwapButton } from './swap-button';
import { StatusChip } from './status-chip';
import { LoadingPlaceholder } from './loading-placeholder';

interface TeacherSwapTableProps {
  isOpen: boolean;
  filter: TtSwapTeacherFilter;
  swapTeacher: ReturnTypeOfUseSwapTeacherAndRoom['swapTeacher'];
  changeState: ReturnTypeOfUseSwapTeacherAndRoom['changeState'];
}

export function TeacherSwapTable({
  isOpen,
  filter,
  swapTeacher,
  changeState,
}: TeacherSwapTableProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const { displayName } = usePreferredNameLayout();
  const { data: availableTeachers, isLoading } =
    useAvailableTeachersForResource(isOpen, filter);

  if (isLoading || changeState.length === 0) {
    return <LoadingPlaceholder />;
  }

  return (
    <SwapStyledTable stickyHeader size="small">
      <TableHead>
        <TableRow>
          <TableCell>{t('timetable:teachersAvailable')}</TableCell>
          {changeState?.map((lesson) => {
            const day = dayjs().set('day', lesson.timeslotId?.dayIdx ?? 0);

            return (
              <TableCell key={JSON.stringify(lesson.id)}>
                <Stack>
                  <span>{lesson.partyGroup.name}</span>
                  <Tooltip
                    title={t('timetable:dayAtTime', {
                      day: day.format('dddd'),
                      time: lesson.timeslotInfo?.startTime,
                    })}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography component="span" className="day-initial">
                        {day.format('dd')[0]}
                      </Typography>
                      <Typography
                        component="span"
                        className="resource-start-time"
                      >
                        {lesson.timeslotInfo?.startTime}
                      </Typography>
                    </Stack>
                  </Tooltip>
                </Stack>
              </TableCell>
            );
          })}
          <TableCell>{t('common:status')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {availableTeachers?.teachers.map(
          ({ staffId, teacher, lessonOnTimeslots }) => (
            <TableRow key={staffId}>
              <>
                <TableCell>
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
          )
        )}
      </TableBody>
    </SwapStyledTable>
  );
}
