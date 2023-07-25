import React, { useEffect, useState } from 'react';
import { wasToggleInSelectionGroupKeyUsed } from '@tyro/core';
import { ReturnTypeFromUseEventsForCover } from '../api/staff-work-events-for-cover';

type SubstitutionEventsByDay =
  ReturnTypeFromUseEventsForCover[number]['substitutionEventsByDay'];

export type CoverEvent =
  SubstitutionEventsByDay[number]['substitutionEventsByPeriod'][number]['event'];

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

  const onSelectEvent = (
    e: React.MouseEvent<Element, MouseEvent>,
    event: CoverEvent
  ) => {
    setSelectedEvents((prev) => {
      if (wasToggleInSelectionGroupKeyUsed(e)) {
        const newMap = new Map(prev);

        if (newMap.has(event.eventId)) {
          newMap.delete(event.eventId);
        } else {
          newMap.set(event.eventId, event);
        }

        return newMap;
      }

      return new Map([[event.eventId, event]]);
    });
  };

  const isEventSelected = (event: CoverEvent) =>
    selectedEvents?.has(event.eventId) ?? false;

  useEffect(() => {
    setSelectedEvents(new Map());
  }, [data]);

  return {
    onSelectEvent,
    isEventSelected,
    selectedEventsMap: selectedEvents,
  };
}

export type ReturnTypeOfUseCoverTable = ReturnType<typeof useCoverTable>;
