import { StaffSelectOption } from '@tyro/people';
import React from 'react';
import { Box, Card, Typography, Divider } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { YearGroupSelect } from '@tyro/groups';

import {
  defaultValues,
  PrintStaffTimetableFormState,
  TimetablePrintForm,
} from '../../components/timetable/timetable-print-form';
import { TimetablePrintStaffForm } from '../../components/timetable/timetable-print-staff-form';
import { TimetablePrintYearGroupForm } from '../../components/timetable/timetable-print-year-form';

function mapper(resources: any): number[] {
  return ((resources as YearGroupSelect[]) ?? []).map((p) => p.partyId);
}
export default function PrintYearGroupTimetable() {
  const { t } = useTranslation(['printing']);

  const methods = useForm<PrintStaffTimetableFormState>({
    defaultValues,
  });
  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <FormProvider {...methods}>
          <TimetablePrintYearGroupForm />
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
