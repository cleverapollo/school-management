import { RHFRoomAutocomplete, RoomSelect } from '@tyro/settings';
import { useFormContext } from 'react-hook-form';

interface StaffTimetableFormState {
  roomIds: NonNullable<RoomSelect[]>;
}

export function TimetablePrintRoomForm() {
  const { register } = useFormContext();
  const { control } = useFormContext<StaffTimetableFormState>();
  register('roomIds');
  return (
    <form>
      <RHFRoomAutocomplete
        multiple
        disableCloseOnSelect
        sx={({ palette }) => ({
          backgroundColor: 'white',
          width: 300,
        })}
        controlProps={{
          name: 'roomIds',
          control,
        }}
      />
    </form>
  );
}
