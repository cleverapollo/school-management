import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@tyro/core';
import { useForm } from 'react-hook-form';
import { Lesson } from '../../../hooks/use-resource-table';
import { useDeleteIndividualLesson } from '../../../api/edit-timetable/delete-individual-lesson';

interface DeleteLessonModalProps {
  timetableId: number;
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson | null;
}

export function DeleteLessonModal({
  timetableId,
  isOpen,
  onClose,
  lessons,
}: DeleteLessonModalProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const { handleSubmit } = useForm();

  const timetableGroupId = lessons?.id?.timetableGroupId;
  const lessonIdx = lessons?.id?.lessonIdx;
  const lessonInstanceIdx = lessons?.id?.lessonInstanceIdx;

  const data = [
    {
      timetableId,
      timetableGroupId: Number(timetableGroupId),
      lessonIdx: Number(lessonIdx),
      lessonInstanceIdx: Number(lessonInstanceIdx),
    },
  ];

  const { mutate: deleteLesson, isLoading } = useDeleteIndividualLesson();

  const handleClose = () => {
    onClose();
  };

  const onSubmit = () => {
    deleteLesson(data);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>{t('timetable:deleteLesson')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack display="flex" sx={{ py: 3 }}>
            <Typography>
              You are about to delete the lesson{' '}
              <Box component="span" fontWeight="bold">
                {lessons?.partyGroup && lessons?.partyGroup?.name}{' '}
              </Box>
              at{' '}
              <Box component="span" fontWeight="bold">
                {lessons?.timeslotInfo?.startTime}.
              </Box>{' '}
              Are you sure you want to continue?
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            color="error"
          >
            {t('common:actions.delete')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
