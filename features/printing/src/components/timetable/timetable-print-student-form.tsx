import { RHFStudentAutocomplete, StaffSelectOption } from '@tyro/people';
import { useFormContext } from 'react-hook-form';
import { PrintStaffTimetableFormState } from './timetable-print-form';

interface StaffTimetableFormState {
  partyIds: NonNullable<StaffSelectOption[]>;
}

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
        variant: 'filled',
        InputProps: { fullWidth: true },
      }}
    />
  );
}
