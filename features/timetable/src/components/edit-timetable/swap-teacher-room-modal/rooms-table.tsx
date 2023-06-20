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
import { ReturnTypeOfUseSwapTeacherAndRoom } from '../../../hooks/use-swap-teacher-and-room';
import { useAvailableRoomsForResource } from '../../../api/available-resource-options';
import { SwapStyledTable } from './table-style';
import { SwapButton } from './swap-button';
import { StatusChip } from './status-chip';
import { LoadingPlaceholder } from './loading-placeholder';

interface RoomSwapTableProps {
  isOpen: boolean;
  filter: TtSwapTeacherFilter;
  swapRoom: ReturnTypeOfUseSwapTeacherAndRoom['swapRoom'];
  changeState: ReturnTypeOfUseSwapTeacherAndRoom['changeState'];
}

export function RoomSwapTable({
  isOpen,
  filter,
  swapRoom,
  changeState,
}: RoomSwapTableProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const { data: availableRooms, isLoading } = useAvailableRoomsForResource(
    isOpen,
    filter
  );

  if (isLoading || changeState.length === 0) {
    return <LoadingPlaceholder />;
  }

  return (
    <SwapStyledTable stickyHeader size="small">
      <TableHead>
        <TableRow>
          <TableCell>{t('timetable:roomsAvailable')}</TableCell>
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
        {availableRooms?.rooms.map(({ roomId, room, lessonOnTimeslots }) => (
          <TableRow key={roomId}>
            <>
              <TableCell>{room.name}</TableCell>
              {changeState?.map(
                (
                  {
                    id,
                    room: roomFromLesson,
                    partyGroup,
                    roomChangesByLessonId,
                  },
                  index
                ) => {
                  const lessonOnTimeslot = lessonOnTimeslots[index] ?? null;
                  const changesForLesson = roomChangesByLessonId.get(
                    JSON.stringify(id)
                  );
                  const changeForCell = changesForLesson?.find(
                    ({ to }) => to.id === roomId
                  );
                  const isSwapped = Boolean(changeForCell);

                  const fromOptions = [
                    {
                      id: roomFromLesson?.roomId ?? 0,
                      label: roomFromLesson?.name ?? '',
                      isSelected:
                        changeForCell?.from.id === roomFromLesson?.roomId,
                      lesson: {
                        id,
                        partyGroup,
                      },
                    },
                  ];

                  return (
                    <TableCell key={JSON.stringify(id)}>
                      <SwapButton
                        fromOptions={fromOptions}
                        to={{
                          id: roomId,
                          lesson: lessonOnTimeslot,
                        }}
                        onClick={swapRoom}
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
