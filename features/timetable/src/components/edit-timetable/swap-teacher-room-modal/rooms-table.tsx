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
import { ReturnTypeOfUseSwapTeacherAndRoom } from '../../../hooks/use-swap-teacher-and-room-modal';
import { useAvailableRoomsForResource } from '../../../api/available-resource-options';
import { SwapStyledTable } from './table-style';
import { SwapButton } from './swap-button';
import { StatusChip } from './status-chip';
import { LoadingPlaceholder } from './loading-placeholder';
import { TableHeaderRow } from './table-header-row';

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
        <TableHeaderRow
          changeState={changeState}
          firstRowLabel={t('timetable:roomsAvailable')}
        />
      </TableHead>
      <TableBody>
        {availableRooms?.rooms.map(({ roomId, room, lessonOnTimeslots }) => (
          <TableRow key={roomId}>
            <>
              <TableCell sx={{ fontWeight: 600 }}>{room.name}</TableCell>
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
