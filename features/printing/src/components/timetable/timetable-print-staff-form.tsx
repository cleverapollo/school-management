import { RHFStaffAutocomplete, StaffSelectOption } from '@tyro/people';
import { RHFSwitch } from '@tyro/core';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { Stack } from '@mui/material';
import { PrintStaffTimetableFormState } from './timetable-print-form';

export function TimetablePrintStaffForm() {
  const { t } = useTranslation(['printing']);
  const { control, watch } =
    useFormContext<PrintStaffTimetableFormState<StaffSelectOption>>();
  const allStaff = watch('allStaff');

  return (
    <Stack direction="row" spacing={2}>
      <RHFStaffAutocomplete
        multiple
        disableCloseOnSelect
        disabled={allStaff}
        sx={() => ({
          width: 300,
          opacity: allStaff ? 0.2 : 1,
        })}
        controlProps={{
          name: 'parties',
          control,
        }}
        inputProps={{
          variant: 'filled',
          InputProps: { fullWidth: true },
        }}
      />
      <RHFSwitch
        label={t('printing:timetable.options.allTeachers')}
        controlLabelProps={{
          sx: { ml: 0, height: '100%', pt: 1 },
        }}
        controlProps={{ name: 'allStaff', control }}
      />
    </Stack>
  );
}
