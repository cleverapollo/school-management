import { StaffSelectOption, StudentSelectOption } from '@tyro/people';
import React from 'react';
import { Box, Card, Typography, Divider } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import {
  defaultValues,
  PrintStaffTimetableFormState,
  TimetablePrintForm,
} from '../../components/timetable/timetable-print-form';
import { TimetablePrintStaffForm } from '../../components/timetable/timetable-print-staff-form';
import { TimetablePrintYearGroupForm } from '../../components/timetable/timetable-print-year-form';
import { TimetablePrintStudentForm } from '../../components/timetable/timetable-print-student-form';

function mapper(resources: any): number[] {
  return ((resources as StudentSelectOption[]) ?? []).map((p) => p.partyId);
}
export default function PrintStudentTimetable() {
  const { t } = useTranslation(['printing']);

  const methods = useForm<PrintStaffTimetableFormState>({
    defaultValues,
  });
  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <FormProvider {...methods}>
          <TimetablePrintStudentForm />
          <Divider textAlign="left" sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('printing:timetable.printOptions')}
            </Typography>
          </Divider>
          <TimetablePrintForm translatePartyIds={mapper} />
        </FormProvider>
      </Card>
    </Box>
  );
}
