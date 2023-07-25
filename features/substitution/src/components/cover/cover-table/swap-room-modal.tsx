import { useMemo } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { LoadingPlaceholder } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { ReturnTypeOfUseCoverTable } from '../../../hooks/use-cover-table';
import { useCoverLookup } from '../../../api/staff-work-cover-lookup';

interface CoverSwapRoomModalProps {
  open: boolean;
  onClose: () => void;
  eventsMap: ReturnTypeOfUseCoverTable['selectedEventsMap'] | null;
}

export function CoverSwapRoomModal({
  open,
  onClose,
  eventsMap,
}: CoverSwapRoomModalProps) {
  const { t } = useTranslation(['common', 'substitution']);

  const substitutionEventIds = useMemo(() => {
    if (!eventsMap) return [];

    return Array.from(eventsMap.values()).map((event) => ({
      eventId: event.eventId,
      date: dayjs(event.startTime).format('YYYY-MM-DD'),
    }));
  }, [eventsMap]);

  const { data, isLoading } = useCoverLookup(
    { substitutionEventIds },
    !!substitutionEventIds.length
  );

  console.log({
    data,
  });

  const onSave = () => {
    console.log('save');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Swap room</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {isLoading ? (
          <LoadingPlaceholder sx={{ minHeight: 200 }} />
        ) : (
          <>Loaded</>
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
        <LoadingButton
          variant="contained"
          // loading={isPublishing}
          onClick={onSave}
        >
          {t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
