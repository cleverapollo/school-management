import { Box, Card, Divider, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { RoomSelect } from '@tyro/settings';
import {
  defaultValues,
  PrintStaffTimetableFormState,
  TimetablePrintForm,
} from '../../components/timetable/timetable-print-form';
import { TimetablePrintRoomForm } from '../../components/timetable/timetable-print-rooms-form';

function mapper(resources: any): number[] {
  return ((resources as RoomSelect[]) ?? []).map((p) => p.roomId);
}
export default function PrintRoomTimetable() {
  const { t } = useTranslation(['printing']);

  const methods = useForm<PrintStaffTimetableFormState>({
    defaultValues,
  });
  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <FormProvider {...methods}>
          <TimetablePrintRoomForm />
          <Divider textAlign="left" sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('printing:timetable.printOptions')}
            </Typography>
          </Divider>
          <TimetablePrintForm translateRoomIds={mapper} />
        </FormProvider>
      </Card>
    </Box>
  );
}
