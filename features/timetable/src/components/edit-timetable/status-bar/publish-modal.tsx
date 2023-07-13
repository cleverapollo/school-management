import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tooltip,
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

  const { timetableId, totalChanges, lessonDiffs, groupDiffs } =
    publishDiff ?? {
      timetableId: 0,
      totalChanges: 0,
      lessonDiffs: [],
      groupDiffs: [],
    };

  const hasNoChanges = !totalChanges;

  const { mutateAsync: publishTimetable, isLoading: isPublishing } =
    useTtPublishTimetable();

  const onPublish = () => {
    publishTimetable(
      {
        timetableId,
        effectiveFromDate: publishFromDate.format('YYYY-MM-DD'),
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

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
        {isLoading ? (
          <LoadingPlaceholder sx={{ minHeight: 200 }} />
        ) : (
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
        <Button
          variant="soft"
          onClick={onClose}
          sx={{
            mr: 2,
          }}
        >
          {t('common:actions.cancel')}
        </Button>
        <Tooltip
          describeChild
          title={hasNoChanges ? t('timetable:thereAreNoChangesAvailable') : ''}
        >
          <span>
            <LoadingButton
              variant="contained"
              loading={isPublishing}
              onClick={onPublish}
              disabled={hasNoChanges}
            >
              {t('common:actions.confirm')}
            </LoadingButton>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
