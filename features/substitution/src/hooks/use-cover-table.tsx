import { useEffect, useState } from 'react';
import { ReturnTypeFromUseEventsForCover } from '../api/staff-work-events-for-cover';
import { getEventId } from '../utils/cover-utils';

type SubstitutionEventsByDay =
  ReturnTypeFromUseEventsForCover[number]['substitutionEventsByDay'];

export type CoverEvent =
  SubstitutionEventsByDay[number]['substitutionEventsByPeriod'][number];

export interface CoverTableRow {
  staff: ReturnTypeFromUseEventsForCover[number]['staff']['person'];
  dayInfo: SubstitutionEventsByDay[number]['dayInfo'];
  requireSubstitutionReason: SubstitutionEventsByDay[number]['requireSubstitutionReason'];
  periods: (
    | SubstitutionEventsByDay[number]['substitutionEventsByPeriod'][number]
    | null
  )[];
}

export function useCoverTable(data: CoverTableRow[]) {
  const [selectedEvents, setSelectedEvents] = useState<Map<string, CoverEvent>>(
    new Map()
  );

  const onSelectEvent = (eventInfo: CoverEvent) => {
    setSelectedEvents((prev) => {
      const newMap = new Map(prev);
      const id = getEventId(eventInfo);

      if (newMap.has(id)) {
        newMap.delete(id);
      } else {
        newMap.set(id, eventInfo);
      }

      return newMap;
    });
  };

  const isEventSelected = (event: CoverEvent) => {
    const id = getEventId(event);
    return selectedEvents?.has(id) ?? false;
  };

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
    window.addEventListener('keydown', onWindowKeyDown);

    return () => {
      window.removeEventListener('click', onWindowClickOrTouchEnd);
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
