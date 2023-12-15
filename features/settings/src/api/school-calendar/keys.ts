import { CalendarDayInfoFilter } from '@tyro/api';

export const schoolCalendarKeys = {
  all: ['school-calendar'] as const,
  dayInfo: (filter: CalendarDayInfoFilter) =>
    [...schoolCalendarKeys.all, 'dayInfo', filter] as const,
  upsertBellTime: () => [...schoolCalendarKeys.all, 'upsertBellTime'] as const,
};
