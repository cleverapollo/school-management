import { CalendarDayInfoFilter } from '@tyro/api';

export const schoolCalendarKeys = {
  all: ['school-calendar'] as const,
  dayInfo: (filter: CalendarDayInfoFilter) =>
    [...schoolCalendarKeys.all, 'dayInfo', filter] as const,
  updateCalendarDays: () =>
    [...schoolCalendarKeys.all, 'updateCalendarDays'] as const,
};
