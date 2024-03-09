import { StaffSelectOption } from '@tyro/people';
import { Card } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import {
  getDefaultValues,
  PrintStaffTimetableFormState,
  TimetablePrintForm,
} from '../../components/timetable/timetable-print-form';
import { TimetablePrintStaffForm } from '../../components/timetable/timetable-print-staff-form';

function mapper(resources: any): number[] {
  return ((resources as StaffSelectOption[]) ?? []).map((p) => p.partyId);
}

const defaultValues = getDefaultValues<StaffSelectOption>();

export default function StudentProfileContainer() {
  const methods = useForm<PrintStaffTimetableFormState<StaffSelectOption>>({
    defaultValues,
  });

  return (
    <Card variant="soft">
      <FormProvider {...methods}>
        <TimetablePrintStaffForm />
        <TimetablePrintForm translateIds={mapper} />
      </FormProvider>
    </Card>
  );
}
