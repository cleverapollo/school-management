import { Card } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { ClassGroupSelect } from '@tyro/groups';

import {
  getDefaultValues,
  PrintStaffTimetableFormState,
  TimetablePrintForm,
} from '../../components/timetable/timetable-print-form';
import { TimetablePrintClassGroupForm } from '../../components/timetable/timetable-print-class-form';

function mapper(resources: any): number[] {
  return ((resources as ClassGroupSelect[]) ?? []).map((p) => p.partyId);
}

const defaultValues = getDefaultValues<ClassGroupSelect>();

export default function PrintYearGroupTimetable() {
  const methods = useForm<PrintStaffTimetableFormState<ClassGroupSelect>>({
    defaultValues,
  });

  return (
    <Card variant="soft">
      <FormProvider {...methods}>
        <TimetablePrintClassGroupForm />
        <TimetablePrintForm translateIds={mapper} />
      </FormProvider>
    </Card>
  );
}
