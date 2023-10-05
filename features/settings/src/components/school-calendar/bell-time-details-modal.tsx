import { Button, Stack, CircularProgress, DialogContent } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  RHFTextField,
  RHFTimePicker,
} from '@tyro/core';
import { CalendarDayBellTime, Scalars } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import React from 'react';
import { useUpsertBellTime } from '../../api/school-calendar/upsert-bell-time';

type BellTimeForm = {
  name: string;
  time: Scalars['Time'];
};

type BellTimeDetailsModalProps = {
  day: string;
  onClose: () => void;
};

export const BellTimeDetailsModal = ({
  day,
  onClose,
}: BellTimeDetailsModalProps) => {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const { handleSubmit, control, setValue, setError, getFieldState } =
    useForm<BellTimeForm>();
  const currentLanguageCode = i18n.language;

  const {
    mutateAsync: createOrUpdateSessionBellTime,
    isLoading: isSessionBellTimeSubmitting,
  } = useUpsertBellTime();

  const onSubmit = handleSubmit(async (data) => {
    await createOrUpdateSessionBellTime({
      name: [
        {
          locale: currentLanguageCode,
          value: data.name,
        },
      ],
      time: dayjs(data.time).format('hh:mm'),
    });

    onClose();
  });

  return (
    <Dialog open onClose={onClose} scroll="paper" fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {t('settings:schoolCalendar.bellTimeDetailsFor', {
          date: dayjs(day)?.format('L'),
        })}
      </DialogTitle>
      {isSessionBellTimeSubmitting ? (
        <Stack minHeight="30vh" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <form onSubmit={onSubmit}>
          <DialogContent sx={{ py: 2 }}>
            <RHFTextField
              label={t('common:name')}
              textFieldProps={{
                fullWidth: true,
                sx: { mb: 2 },
              }}
              controlProps={{
                name: 'name',
                control,
              }}
            />
            <RHFTimePicker
              label={t('common:time')}
              inputProps={{
                fullWidth: true,
                variant: 'outlined',
              }}
              controlProps={{
                name: 'time',
                control,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="soft" color="inherit" onClick={onClose}>
              {t('common:actions.cancel')}
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSessionBellTimeSubmitting}
            >
              {t('common:actions.save')}
            </LoadingButton>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};
