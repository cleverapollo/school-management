import { Card } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { RoomSelect } from '@tyro/settings';
import { useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
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
  const { t } = useTranslation(['common']);
  const { resolver, rules } =
    useFormValidator<PrintStaffTimetableFormState<RoomSelect>>();
  const methods = useForm<PrintStaffTimetableFormState<RoomSelect>>({
    resolver: resolver({
      rooms: rules.validate<RoomSelect[]>((value, throwError, formValues) => {
        if (value.length === 0 && !formValues.allRooms) {
          return throwError(t('common:errorMessages.required'));
        }
      }),
    }),
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
