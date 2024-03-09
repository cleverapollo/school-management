import { Card } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { YearGroupSelect } from '@tyro/groups';
import {
  getDefaultValues,
  PrintStaffTimetableFormState,
  TimetablePrintForm,
} from '../../components/timetable/timetable-print-form';
import { TimetablePrintYearGroupForm } from '../../components/timetable/timetable-print-year-form';

function mapper(resources: any): number[] {
  return ((resources as YearGroupSelect[]) ?? []).map((p) => p.partyId);
}

const defaultValues = getDefaultValues<YearGroupSelect>();

export default function PrintYearGroupTimetable() {
  const methods = useForm<PrintStaffTimetableFormState<YearGroupSelect>>({
    defaultValues,
  });

  return (
    <Card variant="soft">
      <FormProvider {...methods}>
        <TimetablePrintYearGroupForm />
        <TimetablePrintForm translateIds={mapper} />
      </FormProvider>
    </Card>
  );
}
