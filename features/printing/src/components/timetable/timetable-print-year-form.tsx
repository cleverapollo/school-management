import { RHFYearGroupAutocomplete, YearGroupSelect } from '@tyro/groups';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface StaffTimetableFormState {
  partyIds: NonNullable<YearGroupSelect[]>;
}

export function TimetablePrintYearGroupForm() {
  const { register } = useFormContext();
  const { control } = useFormContext<StaffTimetableFormState>();
  register('partyIds');
  return (
    <form>
      <RHFYearGroupAutocomplete
        multiple
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
