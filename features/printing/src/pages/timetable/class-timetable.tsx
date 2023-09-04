import React from 'react';
import { Box, Card, Divider, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { ClassGroupSelect } from '@tyro/groups';

import {
  defaultValues,
  PrintStaffTimetableFormState,
  TimetablePrintForm,
} from '../../components/timetable/timetable-print-form';
import { TimetablePrintClassGroupForm } from '../../components/timetable/timetable-print-class-form';

function mapper(resources: any): number[] {
  return ((resources as ClassGroupSelect[]) ?? []).map((p) => p.partyId);
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
          <TimetablePrintClassGroupForm />
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
