import { DateRangeSwitcher } from '@tyro/core';
import { Box, Stack } from '@mui/material';
import { Dayjs } from 'dayjs';
import { RolebookViewSwitcher } from './view-switcher';
import { AttendanceCodeFilter } from './attendance-code-filter';
import { ReturnTypeFromUseAttendanceCodes } from '../../api/attendance-codes';

interface RolebookToolbarProps {
  dateRange: [Dayjs, Dayjs];
  setDateRange: (range: [Dayjs, Dayjs]) => void;
  view: 'icons' | 'codes';
  setView: (view: 'icons' | 'codes') => void;
  codeFilter: ReturnTypeFromUseAttendanceCodes[];
  setCodeFilter: (value: ReturnTypeFromUseAttendanceCodes[]) => void;
}

export function RolebookToolbar({
  dateRange,
  setDateRange,
  view,
  setView,
  codeFilter,
  setCodeFilter,
}: RolebookToolbarProps) {
  return (
    <Stack direction="row" justifyContent="space-between" p={2}>
      <Box flex="1">
        <RolebookViewSwitcher value={view} onChange={setView} />
      </Box>
      <Box flex="1" display="flex" justifyContent="center" alignItems="center">
        <DateRangeSwitcher
          value={dateRange}
          onChange={setDateRange}
          maxDateRange={(firstSelectedDate) =>
            firstSelectedDate.add(4, 'weeks')
          }
        />
      </Box>
      <Box flex="1" display="flex" justifyContent="flex-end">
        <AttendanceCodeFilter value={codeFilter} onChange={setCodeFilter} />
      </Box>
    </Stack>
  );
}
