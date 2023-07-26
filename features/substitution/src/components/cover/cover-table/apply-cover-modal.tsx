import { useMemo } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { LoadingPlaceholder, RHFAutocomplete } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { ReturnTypeOfUseCoverTable } from '../../../hooks/use-cover-table';
import { useCoverLookup } from '../../../api/staff-work-cover-lookup';

interface ApplyCoverFormState {
  room: string;
}

interface ApplyCoverModalProps {
  open: boolean;
  onClose: () => void;
  eventsMap: ReturnTypeOfUseCoverTable['selectedEventsMap'] | null;
}

export function ApplyCoverModal({
  open,
  onClose,
  eventsMap,
}: ApplyCoverModalProps) {
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

  const rooms = useMemo(() => {
    if (!data) return [];

    return [
      ...data.freeRooms.map((room) => ({
        ...room,
        group: t('substitution:freeRooms'),
      })),
      ...data.clashingRooms.map(({ room }) => ({
        ...room,
        group: t('substitution:clashingRooms'),
      })),
    ];
  }, [data, t]);

  const { reset, control, handleSubmit } = useForm<ApplyCoverFormState>();

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
      <DialogContent>
        {isLoading ? (
          <LoadingPlaceholder sx={{ minHeight: 200 }} />
        ) : (
          <RHFAutocomplete
            label={t('common:room')}
            options={rooms}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => option.name}
            controlProps={{
              name: 'room',
              control,
            }}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="soft" onClick={onClose}>
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
