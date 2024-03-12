import { StaffSelectOption } from '@tyro/people';
import { Card } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { useFormValidator } from '@tyro/core';
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

export default function PrintStaffTimetable() {
  const { t } = useTranslation(['common']);
  const { resolver, rules } =
    useFormValidator<PrintStaffTimetableFormState<StaffSelectOption>>();
  const methods = useForm<PrintStaffTimetableFormState<StaffSelectOption>>({
    resolver: resolver({
      parties: rules.validate<StaffSelectOption[]>(
        (value, throwError, formValues) => {
          if (value.length === 0 && !formValues.allStaff) {
            return throwError(t('common:errorMessages.required'));
          }
        }
      ),
    }),
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
