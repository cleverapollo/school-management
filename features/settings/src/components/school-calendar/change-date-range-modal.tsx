import { Button, DialogContent, Stack } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  RHFTimePicker,
  useFormValidator,
} from '@tyro/core';
import { Scalars } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';

type DateRangeForm = {
  startTime: Scalars['Time'];
  endTime: Scalars['Time'];
};

type ChangeDateRangeModalProps = {
  open: boolean;
  onSave: (start: Scalars['Time'], end: Scalars['Time']) => void;
  onClose: () => void;
};

export const ChangeDateRangeModal = ({
  open,
  onSave,
  onClose,
}: ChangeDateRangeModalProps) => {
  const { t } = useTranslation(['settings', 'common']);

  const { resolver, rules } = useFormValidator<DateRangeForm>();
  const { handleSubmit, control, watch } = useForm<DateRangeForm>({
    resolver: resolver({
      startTime: [
        rules.required(),
        rules.date(t('common:errorMessages.invalidTime')),
      ],
      endTime: [
        rules.required(),
        rules.date(t('common:errorMessages.invalidTime')),
        rules.afterStartDate(
          'startTime',
          t('common:errorMessages.afterStartTime')
        ),
      ],
    }),
  });

  const startTime = watch('startTime');

  const onSubmit = handleSubmit((data) => {
    onSave(data.startTime, data.endTime);
    onClose();
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {t('settings:schoolCalendar.changeStartAndEndTime')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ py: 2 }}>
          <Stack direction="row" gap={2}>
            <RHFTimePicker
              label={t('settings:schoolCalendar.startTime')}
              controlProps={{
                name: 'startTime',
                control,
              }}
              inputProps={{
                sx: { flex: 1 },
              }}
            />
            <RHFTimePicker
              label={t('settings:schoolCalendar.endTime')}
              timePickerProps={{
                minTime: dayjs(startTime),
              }}
              controlProps={{
                name: 'endTime',
                control,
              }}
              inputProps={{
                sx: { flex: 1 },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="soft" color="inherit" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>

          <Button type="submit" variant="contained">
            {t('common:actions.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
