import { RHFClassGroupAutocomplete, ClassGroupSelect } from '@tyro/groups';
import { useFormContext } from 'react-hook-form';
import { RHFSwitch } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Stack } from '@mui/material';
import { PrintStaffTimetableFormState } from './timetable-print-form';

export function TimetablePrintClassGroupForm() {
  const { control } =
    useFormContext<PrintStaffTimetableFormState<ClassGroupSelect>>();
  const { t } = useTranslation(['printing', 'common']);

  return (
    <Stack direction="row" spacing={2}>
      <RHFClassGroupAutocomplete
        multiple
        disableCloseOnSelect
        sx={{
          width: 300,
        }}
        controlProps={{
          name: 'parties',
          control,
        }}
        inputProps={{
          variant: 'white-filled',
          InputProps: { fullWidth: true },
          sx: {
            '& .MuiInputBase-root': {
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              pt: '17px',
            },
          },
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
  );
}
