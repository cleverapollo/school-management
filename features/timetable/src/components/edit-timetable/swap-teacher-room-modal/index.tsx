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
import { useMemo, useState } from 'react';
import { useSwapTeacherAndRoom } from '../../../hooks/use-swap-teacher-and-room';
import { useAvailableRoomsForResource } from '../../../api/available-resource-options';
import { Lesson } from '../../../hooks/use-resource-table';
import { TeacherSwapTable } from './teachers-table';
import { RoomSwapTable } from './rooms-table';

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
  const [visibleView, setVisibleView] = useState(ModalViews.Teacher);

  const { requestFilter, changeState, swapTeacher, swapRoom } =
    useSwapTeacherAndRoom({
      timetableId,
      lessons,
    });

  const { data: availableRooms } = useAvailableRoomsForResource(
    isOpen,
    requestFilter
  );

  const handleClose = () => {
    onClose();
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

        <LoadingButton type="submit" variant="contained" loading={false}>
          {t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
