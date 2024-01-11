import { LoadingButton } from '@mui/lab';
import { Box, Button, Checkbox, Grid, Stack, Typography } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useState } from 'react';
import dayjs from 'dayjs';
import { ReturnTypeFromUseSubjectGroupLessonByIterator } from '../../../api';
import { AttendanceBreakdown } from './breakdown';
import { StudentAttendance } from '../../../hooks';
import { LessonCard } from './lesson-card';

type AdditionalLessonsModalProps = {
  isSaving: boolean;
  attendance: StudentAttendance;
  currentLesson?: ReturnTypeFromUseSubjectGroupLessonByIterator;
  updatedAt: string;
  updatedBy: string;
  lessons: ReturnTypeFromUseSubjectGroupLessonByIterator['additionalLessons'];
  onClose: () => void;
  onSave: (additionalLessonIds: number[]) => void;
};

export function AdditionalLessonsModal({
  isSaving,
  attendance,
  currentLesson,
  updatedAt,
  updatedBy,
  lessons,
  onSave,
  onClose,
}: AdditionalLessonsModalProps) {
  const { t } = useTranslation(['common', 'attendance']);

  const [checkedEvents, setCheckedEvents] = useState<Set<number>>(new Set());

  const handleToggle = (eventId: number) => {
    setCheckedEvents((eventsIds) => {
      if (eventsIds.has(eventId)) {
        eventsIds.delete(eventId);
      } else {
        eventsIds.add(eventId);
      }

      return new Set(eventsIds);
    });
  };

  const handleSave = () => {
    const ids = Array.from(checkedEvents);

    if (ids.length > 0) {
      onSave(ids);
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: ({ spacing }) => ({
          maxWidth: spacing(96),
        }),
      }}
    >
      <DialogTitle onClose={onClose}>
        {t('attendance:additionalLessons.title', { count: lessons.length })}
      </DialogTitle>
      <DialogContent sx={{ overflow: 'initial' }}>
        <Stack direction="column" gap={6}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              backgroundColor: 'slate.100',
              borderRadius: 2.5,
              p: 2.5,
              borderTop: '1px solid',
              borderTopColor: 'indigo.50',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Stack gap={1.5}>
              <Stack flexDirection="row" gap={0.5}>
                <Typography
                  variant="subtitle2"
                  component="span"
                  color="text.secondary"
                >
                  {t('common:saved')}
                </Typography>
                <Typography variant="subtitle2" component="span">
                  {updatedAt ? dayjs(updatedAt).format('L') : '-'}
                </Typography>
              </Stack>

              <LessonCard {...currentLesson} />
            </Stack>
            <Stack gap={1.5} justifyContent="flex-end">
              <Stack flexDirection="row" gap={0.5}>
                <Typography
                  variant="subtitle2"
                  component="span"
                  color="text.secondary"
                >
                  {t('common:by')}
                </Typography>
                <Typography variant="subtitle2" component="span">
                  {updatedBy}
                </Typography>
              </Stack>

              <AttendanceBreakdown
                borderRadius={2}
                padding={1.5}
                attendance={attendance}
              />
            </Stack>
          </Box>
          <Stack gap={4} px={2} mb={6}>
            <Typography variant="subtitle1">
              {t('attendance:additionalLessons.description', {
                count: lessons.length,
              })}
            </Typography>
            <Grid container spacing={3}>
              {lessons.map((lesson) => {
                const { eventId } = lesson;

                return (
                  <Grid key={eventId} item xs={12} sm={7} md={6}>
                    <Stack
                      flexDirection="row"
                      alignItems="center"
                      height="100%"
                      marginRight={{ xs: 0, md: 6 }}
                      gap={2}
                    >
                      <LessonCard
                        {...lesson}
                        onClick={() => handleToggle(eventId)}
                      />
                      <Checkbox
                        checked={checkedEvents.has(eventId)}
                        onChange={() => handleToggle(eventId)}
                      />
                    </Stack>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="soft"
          color="primary"
          disabled={isSaving}
          onClick={onClose}
        >
          {t('common:actions.close')}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSaving}
          onClick={handleSave}
        >
          {t('common:actions.apply')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
