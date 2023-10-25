import { Button, Stack } from '@mui/material';
import {
  LoadingPlaceholder,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useUnpublishedTimetableChanges } from '../../../../api/edit-timetable/unpublished-timetable-changes';
import { GroupUpdatesList } from './groups-updates-list';
import { LessonsUpdatesList } from './lesson-updates-list';

interface UnpublishedChangesModalProps {
  open: boolean;
  onClose: () => void;
}

export function UnpublishedChangesModal({
  open,
  onClose,
}: UnpublishedChangesModalProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const { data: publishDiff, isLoading } = useUnpublishedTimetableChanges(
    { liveTimetable: true },
    open
  );

  const { timetableId, lessonDiffs, groupDiffs } = publishDiff ?? {
    timetableId: 0,
    lessonDiffs: [],
    groupDiffs: [],
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>{t('timetable:unpublishedChanges')}</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {isLoading ? (
          <LoadingPlaceholder sx={{ minHeight: 200 }} />
        ) : (
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
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
