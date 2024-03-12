import { RHFStudentAutocomplete, StaffSelectOption } from '@tyro/people';
import { useFormContext } from 'react-hook-form';
import { PrintStaffTimetableFormState } from './timetable-print-form';

export function TimetablePrintStudentForm() {
  const { control } =
    useFormContext<PrintStaffTimetableFormState<StaffSelectOption>>();

  return (
    <RHFStudentAutocomplete
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
  );
}
