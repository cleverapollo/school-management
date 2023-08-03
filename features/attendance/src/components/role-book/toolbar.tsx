import { DateRangeSwitcher } from '@tyro/core';
import { Box, Stack } from '@mui/material';
import { Dayjs } from 'dayjs';
import { RolebookViewSwitcher } from './view-switcher';

interface RolebookToolbarProps {
  dateRange: [Dayjs, Dayjs];
  setDateRange: (range: [Dayjs, Dayjs]) => void;
  view: 'icons' | 'codes';
  setView: (view: 'icons' | 'codes') => void;
}

export function RolebookToolbar({
  dateRange,
  setDateRange,
  view,
  setView,
}: RolebookToolbarProps) {
  return (
    <Stack direction="row" justifyContent="space-between" p={2}>
      <RolebookViewSwitcher value={view} onChange={setView} />
      <DateRangeSwitcher
        value={dateRange}
        onChange={setDateRange}
        maxDateRange={(firstSelectedDate) => firstSelectedDate.add(4, 'weeks')}
      />
      <Box />
    </Stack>
  );
}
