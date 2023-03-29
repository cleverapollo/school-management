import { EventInput } from '@fullcalendar/core';

// ----------------------------------------------------------------------

export type CalendarView =
  | 'dayGridMonth'
  | 'timeGridWeek'
  | 'timeGridDay'
  | 'listWeek'
  | 'resourceTimelineDay'
  | 'resourceTimeGridDay';

export type CalendarState = {
  isLoading: boolean;
  error: Error | string | null;
  events: EventInput[] | undefined;
  isOpenModal: boolean;
  selectedEventId: null | string;
  selectedRange: null | { start: Date; end: Date };
};
