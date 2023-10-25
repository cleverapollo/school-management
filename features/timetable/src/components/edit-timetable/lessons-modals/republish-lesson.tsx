import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { TtPublishTimetableInput } from '@tyro/api';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@tyro/core';
import { useForm } from 'react-hook-form';
import { Lesson } from '../../../hooks/use-resource-table';
import { useDeleteIndividualLesson } from '../../../api/edit-timetable/delete-individual-lesson';
import {useMemo} from "react";
import {useTtPublishTimetable} from "../../../api/edit-timetable/publish-timetable";

interface RepublishLessonModalProps {
  timetableId: number;
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson[] | null;
}

export function RepublishLessonModal({
  timetableId,
  isOpen,
  onClose,
  lessons,
}: RepublishLessonModalProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const { handleSubmit } = useForm();

  // const timetableGroupId = lessons?.id?.timetableGroupId;
  // const lessonIdx = lessons?.id?.lessonIdx;
  // const lessonInstanceIdx = lessons?.id?.lessonInstanceIdx;

  const data = useMemo(() => {
    const lessonIds = lessons?.map((lesson) => lesson.id);
    return {
      timetableId,
      effectiveFromDate: '2023-08-14',
      futureLessonIds: false,
      republishLessonsInstances: lessonIds,
    } as TtPublishTimetableInput;
  }, [lessons]);


  const { mutate: publish, isLoading } = useTtPublishTimetable();

  const handleClose = () => {
    onClose();
  };

  const onSubmit = () => {
    publish(data);
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
      <DialogTitle onClose={onClose}>{t('timetable:republishLesson')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack display="flex" sx={{ py: 3 }}>
            <Typography>
              {t('timetable:republishIndividual', {count: lessons?.length})}
              {t('timetable:republishIndividualText')}
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
            {t('timetable:publish')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
