import { RHFYearGroupAutocomplete, YearGroupSelect } from '@tyro/groups';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { RHFSwitch } from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { Stack } from '@mui/material';

interface StaffTimetableFormState {
  partyIds: NonNullable<YearGroupSelect[]>;
  individualStudents: boolean;
}

export function TimetablePrintYearGroupForm() {
  const { register } = useFormContext();
  const { control } = useFormContext<StaffTimetableFormState>();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { t } = useTranslation(['printing', 'common']);
  register('partyIds');
  register('individualStudents');
  return (
    <form>
      <Stack direction="row" spacing={2}>
        <RHFYearGroupAutocomplete
          multiple
          disableCloseOnSelect
          sx={({ palette }) => ({
            backgroundColor: 'white',
            width: 300,
          })}
          controlProps={{
            name: 'partyIds',
            control,
          }}
        />
        <RHFSwitch
          label={t(`printing:timetable.options.individualStudents`)}
          controlLabelProps={{
            sx: { ml: 0, height: '100%', pt: 1 },
          }}
          controlProps={{ name: 'individualStudents', control }}
        />
      </Stack>
    </form>
  );
}
