import { RHFRoomAutocomplete, RoomSelect } from '@tyro/settings';
import { useTranslation } from '@tyro/i18n';
import { useFormContext } from 'react-hook-form';
import { Stack } from '@mui/material';
import { RHFSwitch } from '@tyro/core';

interface RoomsTimetableFormState {
  roomIds: NonNullable<RoomSelect[]>;
  allRooms: boolean;
}

export function TimetablePrintRoomForm() {
  const { t } = useTranslation(['printing']);

  const { control, watch } = useFormContext<RoomsTimetableFormState>();
  const allRooms = watch('allRooms');

  return (
    <form>
      <Stack direction="row" spacing={2}>
        <RHFRoomAutocomplete
          multiple
          disableCloseOnSelect
          disabled={allRooms}
          sx={() => ({
            backgroundColor: 'white',
            width: 300,
            opacity: allRooms ? 0.2 : 1,
          })}
          controlProps={{
            name: 'roomIds',
            control,
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
    </form>
  );
}
