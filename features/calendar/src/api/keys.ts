import {
  CalendarDayBellTimeFilter,
  CalendarDayInfoFilter,
  CalendarEventFilter,
  FindFreeResourcesFilter,
} from '@tyro/api';

export const calendarKeys = {
  all: ['calendar'] as const,
  search: (query: string) => [...calendarKeys.all, 'search', query] as const,
  events: (filter: CalendarEventFilter) =>
    [...calendarKeys.all, 'events', filter] as const,
  timetable: (filter: CalendarEventFilter) =>
    [...calendarKeys.all, 'timetable', filter] as const,
  dayInfo: (filter: CalendarDayInfoFilter) =>
    [...calendarKeys.all, 'timetable', 'day-info', filter] as const,
  createEvent: () => [...calendarKeys.all, 'createEvent'] as const,
  roomLocation: (filter: FindFreeResourcesFilter) =>
    [...calendarKeys.all, 'roomLocation', filter] as const,
  calendarDayBellTimes: (filter: CalendarDayBellTimeFilter) =>
    [...calendarKeys.all, 'calendarDayBellTimes', filter] as const,
};
