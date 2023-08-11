import { useParams } from 'react-router-dom';
import {
  StaffAutocomplete,
  StaffSelectOption,
  useStaffForSelect,
  useStudentsForSelect,
} from '@tyro/people';
import { useTranslation } from '@tyro/i18n';
import React, { useEffect, useState } from 'react';
import { Button, Stack, useTheme } from '@mui/material';
import { Print_TimetableOptions } from '@tyro/api';
import { usePrintTimetable } from '../../api/print-timetable';

export default function StudentProfileContainer() {
  const { t } = useTranslation(['printing', 'common']);
  const { spacing } = useTheme();
  const [selectedStaff, setSelectedStaff] = useState<StaffSelectOption[]>([]);
  const { data: teacherData } = useStaffForSelect({});
  const [filter, setFilter] = useState<Print_TimetableOptions>({
    partyIds: [1],
    daysXPeriodsY: true,
    individual: true,
  } as Print_TimetableOptions);
  const { data: printTimetableUrl = null } = usePrintTimetable(filter);
  useEffect(() => {
    if (teacherData && !selectedStaff) {
      setSelectedStaff(teacherData);
    }
  }, [teacherData]);

  return (
    <>
      <StaffAutocomplete
        inputProps={{
          variant: 'white-filled',
        }}
        multiple
        sx={{ maxWidth: spacing(36) }}
        value={selectedStaff}
        // @ts-expect-error
        onChange={(_e, value) => setSelectedStaff(value ?? [])}
      />
      HERE{printTimetableUrl}IT IS
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            // const result = q({
            //   partyIds: selectedStaff.map((staff) => staff.partyId),
            //   daysXPeriodsY: true,
            //   individual: true,
            // });
            console.log('a');
          }}
        >
          {t('common:actions.view')}
        </Button>
        <Button variant="outlined" color="inherit">
          {t('common:actions.print')}
        </Button>
      </Stack>
    </>
  );
}
