import { useEffect, useState } from 'react';
import { ReturnTypeFromUseEventsForCover } from '../api/staff-work-events-for-cover';

type SubstitutionEventsByDay =
  ReturnTypeFromUseEventsForCover[number]['substitutionEventsByDay'];

export type CoverEvent =
  SubstitutionEventsByDay[number]['substitutionEventsByPeriod'][number];

export interface CoverTableRow {
  staff: ReturnTypeFromUseEventsForCover[number]['staff']['person'];
  dayInfo: SubstitutionEventsByDay[number]['dayInfo'];
  periods: (
    | SubstitutionEventsByDay[number]['substitutionEventsByPeriod'][number]
    | null
  )[];
}

export function useCoverTable(data: CoverTableRow[]) {
  const [selectedEvents, setSelectedEvents] = useState<Map<number, CoverEvent>>(
    new Map()
  );

  const onSelectEvent = (eventInfo: CoverEvent) => {
    setSelectedEvents((prev) => {
      const newMap = new Map(prev);
      const { eventId } = eventInfo.event;

      if (newMap.has(eventId)) {
        newMap.delete(eventId);
      } else {
        newMap.set(eventId, eventInfo);
      }

      return newMap;
    });
  };

  const isEventSelected = ({ event }: CoverEvent) =>
    selectedEvents?.has(event.eventId) ?? false;

  const resetSelectedEvents = () => {
    setSelectedEvents(new Map());
  };

  useEffect(() => {
    resetSelectedEvents();
  }, [data]);

  useEffect(() => {
    const onWindowClickOrTouchEnd = (event: MouseEvent | TouchEvent) => {
      if (event.defaultPrevented) return;

      resetSelectedEvents();
    };

    const onWindowKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      if (event.key === 'Escape') {
        resetSelectedEvents();
      }
    };

    window.addEventListener('click', onWindowClickOrTouchEnd);
    window.addEventListener('touchend', onWindowClickOrTouchEnd);
    window.addEventListener('keydown', onWindowKeyDown);

    return () => {
      window.removeEventListener('click', onWindowClickOrTouchEnd);
      window.removeEventListener('touchend', onWindowClickOrTouchEnd);
      window.removeEventListener('keydown', onWindowKeyDown);
    };
  }, []);

  return {
    onSelectEvent,
    isEventSelected,
    selectedEventsMap: selectedEvents,
  };
}

export type ReturnTypeOfUseCoverTable = ReturnType<typeof useCoverTable>;
