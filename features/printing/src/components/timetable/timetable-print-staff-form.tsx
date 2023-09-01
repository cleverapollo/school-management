import { RHFStaffAutocomplete, StaffSelectOption } from '@tyro/people';
import { RHFSwitch } from '@tyro/core';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { Stack } from '@mui/material';

interface StaffTimetableFormState {
  partyIds: NonNullable<StaffSelectOption[]>;
  allStaff: boolean;
}

export function TimetablePrintStaffForm() {
  const { t } = useTranslation(['printing']);
  const { control, watch } = useFormContext<StaffTimetableFormState>();
  const allStaff = watch('allStaff');

  return (
    <form>
      <Stack direction="row" spacing={2}>
        <RHFStaffAutocomplete
          multiple
          disableCloseOnSelect
          disabled={allStaff}
          sx={() => ({
            backgroundColor: 'white',
            width: 300,
            opacity: allStaff ? 0.2 : 1,
          })}
          controlProps={{
            name: 'partyIds',
            control,
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
    </form>
  );
}
