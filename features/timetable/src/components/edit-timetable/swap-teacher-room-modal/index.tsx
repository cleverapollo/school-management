import { LoadingButton } from '@mui/lab';
import { Button, Stack, Tab, Tabs } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useState } from 'react';
import { TtSwapsInput } from '@tyro/api';
import {
  SearchInput,
  useToast,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@tyro/core';
import { useSwapTeacherAndRoomModal } from '../../../hooks/use-swap-teacher-and-room-modal';
import { Lesson } from '../../../hooks/use-resource-table';
import { TeacherSwapTable } from './teachers-table';
import { RoomSwapTable } from './rooms-table';
import { useSwapTeachersAndRooms } from '../../../api/edit-timetable/swap-teachers-and-rooms';

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

function getModalMaxWidth(numberOfLessons: number) {
  if (numberOfLessons <= 2) return 'sm';
  if (numberOfLessons <= 4) return 'md';
  if (numberOfLessons <= 6) return 'lg';
  return 'xl';
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
  const [searchValue, setSearchValue] = useState('');

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
        onSuccess: handleClose,
      });
    }
  };

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={handleClose}
      maxWidth={getModalMaxWidth(lessons?.length ?? 0)}
      fullWidth
      PaperProps={{
        sx: {
          height: '100%',
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        p={3}
        pb={0}
      >
        <Stack>
          <DialogTitle onClose={onClose} sx={{ p: 0 }}>{t('timetable:swapping')}</DialogTitle>
          <Tabs
            value={visibleView}
            onChange={(_event, newValue: ModalViews) => {
              setSearchValue('');
              setVisibleView(newValue);
            }}
            aria-label={t('timetable:selectIfYouWantSwapTeachersOrRooms')}
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
        </Stack>
        <SearchInput
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </Stack>
      <DialogContent>
        {visibleView === ModalViews.Teacher ? (
          <TeacherSwapTable
            isOpen={isOpen}
            filter={requestFilter}
            swapTeacher={swapTeacher}
            changeState={changeState}
            searchValue={searchValue}
          />
        ) : (
          <RoomSwapTable
            isOpen={isOpen}
            filter={requestFilter}
            swapRoom={swapRoom}
            changeState={changeState}
            searchValue={searchValue}
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
