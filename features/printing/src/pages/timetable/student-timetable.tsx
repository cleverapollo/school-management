import { StudentSelectOption } from '@tyro/people';
import { Card } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import {
  getDefaultValues,
  PrintStaffTimetableFormState,
  TimetablePrintForm,
} from '../../components/timetable/timetable-print-form';
import { TimetablePrintStudentForm } from '../../components/timetable/timetable-print-student-form';

function mapper(resources: any): number[] {
  return ((resources as StudentSelectOption[]) ?? []).map((p) => p.partyId);
}

const defaultValues = getDefaultValues<StudentSelectOption>();

export default function PrintStudentTimetable() {
  const methods = useForm<PrintStaffTimetableFormState<StudentSelectOption>>({
    defaultValues,
  });

  return (
    <Card variant="soft">
      <FormProvider {...methods}>
        <TimetablePrintStudentForm />
        <TimetablePrintForm translateIds={mapper} />
      </FormProvider>
    </Card>
  );
}
