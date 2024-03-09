import { RHFRoomAutocomplete, RoomSelect } from '@tyro/settings';
import { useTranslation } from '@tyro/i18n';
import { useFormContext } from 'react-hook-form';
import { Stack } from '@mui/material';
import { RHFSwitch } from '@tyro/core';
import { PrintStaffTimetableFormState } from './timetable-print-form';

export function TimetablePrintRoomForm() {
  const { t } = useTranslation(['printing']);
  const { control, watch } =
    useFormContext<PrintStaffTimetableFormState<RoomSelect>>();
  const allRooms = watch('allRooms');

  return (
    <Stack direction="row" spacing={2}>
      <RHFRoomAutocomplete
        multiple
        disableCloseOnSelect
        disabled={allRooms}
        sx={() => ({
          width: 300,
          opacity: allRooms ? 0.2 : 1,
        })}
        controlProps={{
          name: 'rooms',
          control,
        }}
        inputProps={{
          variant: 'filled',
          InputProps: { fullWidth: true },
        }}
      />
      <RHFSwitch
        label={t('printing:timetable.options.allRooms')}
        controlLabelProps={{
          sx: { ml: 0, height: '100%', pt: 1 },
        }}
        controlProps={{ name: 'allRooms', control }}
      />
    </Stack>
  );
}
