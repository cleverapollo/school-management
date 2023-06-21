import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useState } from 'react';
import { TtSwapsInput } from '@tyro/api';
import { useToast } from '@tyro/core';
import { useSwapTeacherAndRoomModal } from '../../../hooks/use-swap-teacher-and-room-modal';
import { Lesson } from '../../../hooks/use-resource-table';
import { TeacherSwapTable } from './teachers-table';
import { RoomSwapTable } from './rooms-table';
import { useSwapTeachersAndRooms } from '../../../api/swap-teachers-and-rooms';

interface SwapTeacherRoomModalProps {
  timetableId: number;
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson[] | null;
}

enum ModalViews {
  Teacher = 'teacher',
  Room = 'room',
}

export function SwapTeacherRoomModal({
  isOpen,
  onClose,
  timetableId,
  lessons,
}: SwapTeacherRoomModalProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const { toast } = useToast();
  const [visibleView, setVisibleView] = useState(ModalViews.Teacher);

  const { mutateAsync: swapTeachersAndRooms, isLoading } =
    useSwapTeachersAndRooms();
  const { requestFilter, changeState, swapTeacher, swapRoom } =
    useSwapTeacherAndRoomModal({
      timetableId,
      lessons,
    });

  const handleClose = () => {
    onClose();
  };

  const onSave = async () => {
    const changes = changeState.reduce<TtSwapsInput>(
      (acc, lesson) => {
        const lessonId = JSON.stringify(lesson.id);
        const roomChanges = lesson.roomChangesByLessonId.get(lessonId);
        const teacherChanges = lesson.teacherChangesByLessonId.get(lessonId);

        roomChanges?.forEach(({ to }) => {
          acc.roomsSwaps!.push({
            lessonInstanceId: lesson.id,
            timeslotId: lesson.timeslotId!,
            swapToRoomId: to.id,
          });
        });

        teacherChanges?.forEach(({ from, to }) => {
          acc.teacherSwaps!.push({
            lessonInstanceId: lesson.id,
            timeslotId: lesson.timeslotId!,
            swapFromStaffId: from.id,
            swapToStaffId: to.id,
          });
        });

        return acc;
      },
      {
        timetableId,
        roomsSwaps: [],
        teacherSwaps: [],
      }
    );

    if (!changes.roomsSwaps?.length && !changes.teacherSwaps?.length) {
      toast(t('timetable:nothingToSwap'), { variant: 'warning' });
    } else {
      await swapTeachersAndRooms(changes, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  return (
    <Dialog scroll="paper" open={isOpen} onClose={handleClose} maxWidth="xl">
      <Box p={3}>
        <DialogTitle sx={{ p: 0 }}>{t('timetable:swapping')}</DialogTitle>
        <Tabs
          value={visibleView}
          onChange={(event, newValue: ModalViews) => setVisibleView(newValue)}
          aria-label="Select if you want to swap teachers or rooms"
          sx={{
            minHeight: 32,
            '& button': {
              fontSize: '0.75rem',
              minHeight: 32,

              '&:not(:last-of-type)': {
                mr: 2,
              },
            },
          }}
        >
          <Tab value={ModalViews.Teacher} label={t('common:teacher')} />
          <Tab value={ModalViews.Room} label={t('timetable:room')} />
        </Tabs>
      </Box>
      <DialogContent>
        {visibleView === ModalViews.Teacher ? (
          <TeacherSwapTable
            isOpen={isOpen}
            filter={requestFilter}
            swapTeacher={swapTeacher}
            changeState={changeState}
          />
        ) : (
          <RoomSwapTable
            isOpen={isOpen}
            filter={requestFilter}
            swapRoom={swapRoom}
            changeState={changeState}
          />
        )}
      </DialogContent>
      <DialogActions
        sx={({ palette }) => ({
          borderTop: `1px solid ${palette.divider}`,
        })}
      >
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          {t('common:actions.cancel')}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          onClick={onSave}
          loading={isLoading}
        >
          {t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
