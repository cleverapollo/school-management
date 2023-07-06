import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingPlaceholder } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { useTtPublishTimetable } from '../../../api/edit-timetable/publish-timetable';
import { useUnpublishedTimetableChanges } from '../../../api/edit-timetable/unpublished-timetable-changes';
import { GroupUpdatesList } from './unpublished-changes-modal/groups-updates-list';
import { LessonsUpdatesList } from './unpublished-changes-modal/lesson-updates-list';

interface UnpublishedChangesModalProps {
  open: boolean;
  onClose: () => void;
}

const tomorrow = dayjs().add(1, 'day');

export function PublishModal({ open, onClose }: UnpublishedChangesModalProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const [publishFromDate, setPublishFromDate] = useState<Dayjs>(tomorrow);
  const { data: publishDiff, isLoading } = useUnpublishedTimetableChanges(
    { liveTimetable: true },
    open
  );

  const { timetableId, lessonDiffs, groupDiffs } = publishDiff ?? {
    timetableId: 0,
    lessonDiffs: [],
    groupDiffs: [],
  };

  const { mutateAsync: publishTimetable } = useTtPublishTimetable();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {t('timetable:whenWouldYouLikeTheFollowingChangesToBeEffectiveFrom')}
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {isLoading && <LoadingPlaceholder sx={{ minHeight: 200 }} />}
        {!isLoading && (
          <>
            <DatePicker
              label={t('timetable:effectiveFrom')}
              value={publishFromDate}
              onChange={(date) => {
                if (date) {
                  setPublishFromDate(date);
                }
              }}
              minDate={tomorrow}
              sx={{
                mx: 3,
                mt: 2,
                mb: 4,
              }}
            />
            <Stack spacing={2}>
              <GroupUpdatesList
                timetableId={timetableId}
                groupDiffs={groupDiffs}
              />
              <LessonsUpdatesList
                timetableId={timetableId}
                lessonDiffs={lessonDiffs}
              />
            </Stack>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="soft" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            publishTimetable({
              timetableId,
              effectiveFromDate: publishFromDate.format('YYYY-MM-DD'),
            });
          }}
        >
          {t('common:actions.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
