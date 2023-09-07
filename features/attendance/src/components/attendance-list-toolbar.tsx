import { DateRangeSwitcher } from '@tyro/core';
import { Box, Stack } from '@mui/material';
import { Dayjs } from 'dayjs';
import { AttendanceCodeFilter } from './attendance-code-filter';
import { ReturnTypeFromUseAttendanceCodes } from '../api/attendance-codes';

interface AttendanceListToolbar {
  dateRange: [Dayjs, Dayjs];
  setDateRange: (range: [Dayjs, Dayjs]) => void;
  codeFilter: ReturnTypeFromUseAttendanceCodes[];
  setCodeFilter: (value: ReturnTypeFromUseAttendanceCodes[]) => void;
}

export function AttendanceListToolbar({
  dateRange,
  setDateRange,
  codeFilter,
  setCodeFilter,
}: AttendanceListToolbar) {
  return (
    <Stack direction="row" justifyContent="space-between" p={2}>
      <Box flex="1" display="flex" justifyContent="flex-start" alignItems="center">
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
