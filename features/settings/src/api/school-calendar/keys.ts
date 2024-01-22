import { CalendarFilter } from '@tyro/api';

export const schoolCalendarKeys = {
  all: ['school-calendar'] as const,
  dayInfo: (filter: CalendarFilter) =>
    [...schoolCalendarKeys.all, 'dayInfo', filter] as const,
};
