import { LoadingButton } from '@mui/lab';
import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ReturnTypeFromUseSubjectGroupLessonByIterator } from '../../../api';

type AdditionalLessonsModalProps = {
  events: ReturnTypeFromUseSubjectGroupLessonByIterator['eventsOnSameDayForSameGroup'];
  onClose: () => void;
  onSave: (additionalLessonIds: number[], onSuccess: () => void) => void;
};

export function AdditionalLessonsModal({
  events,
  onSave,
  onClose,
}: AdditionalLessonsModalProps) {
  const { t } = useTranslation(['common', 'attendance']);

  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    onSave(Array.from(checkedEvents), () => {
      setIsSubmitting(false);
    });
  };

  return (
    <Dialog open onClose={onClose} scroll="paper" fullWidth maxWidth="xs">
      <DialogTitle onClose={onClose}>
        {t('attendance:additionalLessons.title', { count: events.length })}
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={2}>
          <DialogContentText>
            {t('attendance:additionalLessons.description', {
              count: events.length,
            })}
          </DialogContentText>
          <List>
            {events.map(({ eventId, startTime }) => (
              <ListItem key={eventId} disablePadding>
                <ListItemButton
                  dense
                  role={undefined}
                  sx={({ spacing }) => ({ borderRadius: spacing(1) })}
                  onClick={() => handleToggle(eventId)}
                >
                  <ListItemText
                    id={`${eventId}`}
                    primary={dayjs(startTime).format('HH:mm')}
                  />
                  <Checkbox
                    edge="end"
                    checked={checkedEvents.has(eventId)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': `${eventId}` }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          disabled={isSubmitting}
          onClick={onClose}
        >
          {t('common:actions.cancel')}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSave}
        >
          {t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
