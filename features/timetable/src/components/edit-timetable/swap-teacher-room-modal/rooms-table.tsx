import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { TtSwapTeacherFilter } from '@tyro/api';
import { LoadingPlaceholder } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useMemo, useState } from 'react';
import {
  LessonChangeState,
  ReturnTypeOfUseSwapTeacherAndRoom,
} from '../../../hooks/use-swap-teacher-and-room-modal';
import { useAvailableRoomsForResource } from '../../../api/edit-timetable/available-resource-options';
import { SwapStyledTable } from './table-style';
import { SwapButton, UndoSwapButton } from './swap-button';
import { StatusChip } from './status-chip';
import {
  getFixedRowStyles,
  TableHeaderRow,
  TABLE_HEADER_ROW_HEIGHT,
} from './common-table-elements';

interface RoomSwapTableProps {
  isOpen: boolean;
  filter: TtSwapTeacherFilter;
  swapRoom: ReturnTypeOfUseSwapTeacherAndRoom['swapRoom'];
  changeState: ReturnTypeOfUseSwapTeacherAndRoom['changeState'];
  searchValue: string;
}

export function RoomSwapTable({
  isOpen,
  filter,
  swapRoom,
  changeState,
  searchValue,
}: RoomSwapTableProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const { data: availableRooms, isLoading } = useAvailableRoomsForResource(
    isOpen,
    filter
  );
  const [hoveredLessonChangeState, setHoveredLessonChangeState] = useState<
    LessonChangeState | undefined
  >(changeState[0]);
  const hoveredLessonIndex = useMemo(
    () =>
      changeState.findIndex(({ id }) => id === hoveredLessonChangeState?.id),
    [changeState, hoveredLessonChangeState]
  );

  const filteredRooms = useMemo(
    () =>
      availableRooms?.rooms
        .filter(({ room }) =>
          room.name.toLowerCase().includes(searchValue.toLowerCase())
        )
        .sort(
          (
            { roomId: roomIdA, room: { name: nameA } },
            { roomId: roomIdB, room: { name: nameB } }
          ) => {
            if (roomIdA === hoveredLessonChangeState?.room?.roomId) {
              return -1;
            }

            if (roomIdB === hoveredLessonChangeState?.room?.roomId) {
              return 1;
            }

            return nameA.localeCompare(nameB);
          }
        ) ?? [],
    [availableRooms, searchValue, hoveredLessonChangeState]
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
          firstRowLabel={t('timetable:roomsAvailable')}
        />
      </TableHead>
      <TableBody sx={getFixedRowStyles(hoveredLessonIndex + 2, 1)}>
        {filteredRooms.map(({ roomId, room, lessonOnTimeslots }) => {
          const isCurrentRoom =
            roomId === hoveredLessonChangeState?.room?.roomId;
          const stickyTop = TABLE_HEADER_ROW_HEIGHT;

          return (
            <TableRow
              className={isCurrentRoom ? 'fixed-row' : undefined}
              key={roomId}
              sx={{
                ...(isCurrentRoom && {
                  top: stickyTop,
                }),
              }}
            >
              <>
                <TableCell sx={{ fontWeight: 600 }}>{room.name}</TableCell>
                {changeState?.map((lessonChangeState, index) => {
                  const {
                    id,
                    room: roomFromLesson,
                    partyGroup,
                    roomChangesByLessonId,
                  } = lessonChangeState;
                  const lessonOnTimeslot = lessonOnTimeslots[index] ?? null;
                  const changesForLesson = roomChangesByLessonId.get(
                    JSON.stringify(id)
                  );
                  const changeForCell = changesForLesson?.find(
                    ({ to, from }) => to.id === roomId || from.id === roomId
                  );
                  const newRoomForCurrentRoom = Object.values(
                    changeForCell ?? {}
                  ).find((value) => value?.id !== roomId);
                  const isCurrentRoomForCell = Boolean(
                    roomFromLesson?.roomId === roomId
                  );
                  const isSwapped = Boolean(changeForCell);
                  const setHoveredToCurrentState = () => {
                    if (lessonChangeState.id !== hoveredLessonChangeState?.id) {
                      setHoveredLessonChangeState(lessonChangeState);
                    }
                  };

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
                    <TableCell
                      key={JSON.stringify(id)}
                      onMouseEnter={setHoveredToCurrentState}
                    >
                      {isCurrentRoomForCell ? (
                        <UndoSwapButton
                          isSwapped={isSwapped}
                          newLesson={newRoomForCurrentRoom?.lesson}
                          originalLesson={lessonOnTimeslot}
                          onClick={() => {
                            if (changeForCell) {
                              swapRoom(changeForCell);
                            }
                          }}
                        />
                      ) : (
                        <SwapButton
                          fromOptions={fromOptions}
                          to={{
                            id: roomId,
                            lesson: lessonOnTimeslot,
                          }}
                          onClick={swapRoom}
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
        })}
      </TableBody>
    </SwapStyledTable>
  );
}
