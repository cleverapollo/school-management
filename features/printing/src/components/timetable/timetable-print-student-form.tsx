import { RHFStudentAutocomplete, StaffSelectOption } from '@tyro/people';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface StaffTimetableFormState {
  partyIds: NonNullable<StaffSelectOption[]>;
}

export function TimetablePrintStudentForm() {
  const { register } = useFormContext();
  const { control } = useFormContext<StaffTimetableFormState>();
  register('partyIds');
  return (
    <form>
      <RHFStudentAutocomplete
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
    </form>
  );
}
