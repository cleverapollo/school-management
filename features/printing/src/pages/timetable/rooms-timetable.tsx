import { Card } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { RoomSelect } from '@tyro/settings';
import {
  getDefaultValues,
  PrintStaffTimetableFormState,
  TimetablePrintForm,
} from '../../components/timetable/timetable-print-form';
import { TimetablePrintRoomForm } from '../../components/timetable/timetable-print-rooms-form';

function mapper(resources: any): number[] {
  return ((resources as RoomSelect[]) ?? []).map((p) => p.roomId);
}

const defaultValues = getDefaultValues<RoomSelect>();

export default function PrintRoomTimetable() {
  const methods = useForm<PrintStaffTimetableFormState<RoomSelect>>({
    defaultValues,
  });

  return (
    <Card variant="soft">
      <FormProvider {...methods}>
        <TimetablePrintRoomForm />
        <TimetablePrintForm translateIds={mapper} isRoom />
      </FormProvider>
    </Card>
  );
}
