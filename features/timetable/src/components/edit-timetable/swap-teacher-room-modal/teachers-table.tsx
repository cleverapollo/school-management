import {
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
import { usePreferredNameLayout } from '@tyro/core';
import { ReturnTypeOfUseSwapTeacherAndRoom } from '../../../hooks/use-swap-teacher-and-room';
import { useAvailableTeachersForResource } from '../../../api/available-resource-options';
import { SwapStyledTable } from './table-style';
import { SwapButton } from './swap-button';

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
  const { data: availableTeachers } = useAvailableTeachersForResource(
    isOpen,
    filter
  );

  return (
    <SwapStyledTable>
      <TableHead>
        <TableRow>
          <TableCell>{t('timetable:teachersAvailable')}</TableCell>
          {changeState?.map((lesson) => {
            const day = dayjs().set('day', lesson.timeslotId?.dayIdx ?? 0);

            return (
              <TableCell key={JSON.stringify(lesson.id)}>
                <Stack>
                  <Typography component="span">
                    {lesson.partyGroup.name}
                  </Typography>
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
        {availableTeachers?.teachers.map(({ staffId, lessonOnTimeslots }) => (
          <TableRow key={staffId}>
            <>
              <TableCell>{staffId}</TableCell>
              {changeState?.map(
                (
                  { id, teachers, partyGroup, teacherChangesByLessonId },
                  index
                ) => {
                  const lessonOnTimeslot = lessonOnTimeslots[index] ?? null;
                  const changesForLesson = teacherChangesByLessonId.get(
                    JSON.stringify(id)
                  );
                  const isSwapped =
                    changesForLesson?.some(({ to }) => to.id === staffId) ??
                    false;

                  const fromOptions = teachers.map((teacher) => ({
                    id: teacher.person.partyId,
                    label: displayName(teacher.person),
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
            </>
          </TableRow>
        ))}
      </TableBody>
    </SwapStyledTable>
  );
}
