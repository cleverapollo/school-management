import { useDebouncedValue } from '@tyro/core';
import { RecurrenceEnum } from '@tyro/api';
import { useEffect } from 'react';
import { ScheduleEventFormState } from '../schedule-event';
import { RecurrenceFilter } from '../room-location-options';
import { ALL_DAY_END_TIME, ALL_DAY_START_TIME } from '../constants';

export const useGetRecurrenceFilter = ({
  allDayEvent,
  startDate,
  startTime,
  endTime,
  recurrenceEnum,
  occurrences,
  endDate,
}: Pick<
  ScheduleEventFormState,
  | 'allDayEvent'
  | 'startDate'
  | 'startTime'
  | 'endTime'
  | 'recurrenceEnum'
  | 'endDate'
  | 'occurrences'
>): RecurrenceFilter => {
  const {
    setValue: setRecurrenceFilter,
    debouncedValue: debouncedRecurrenceFilter,
  } = useDebouncedValue<RecurrenceFilter>({
    defaultValue: null,
    delay: 300,
  });

  useEffect(() => {
    const areValidRequiredDates =
      startDate &&
      startDate.isValid() &&
      startTime &&
      startTime.isValid() &&
      endTime &&
      endTime.isValid();

    if (!areValidRequiredDates || !recurrenceEnum) {
      return setRecurrenceFilter(null);
    }

    const baseFilters = {
      recurrence: recurrenceEnum,
      fromDate: startDate.format('YYYY-MM-DD'),
      startTime: allDayEvent ? ALL_DAY_START_TIME : startTime.format('HH:mm'),
      endTime: allDayEvent ? ALL_DAY_END_TIME : endTime.format('HH:mm'),
    };

    if (recurrenceEnum === RecurrenceEnum.NoRecurrence) {
      return setRecurrenceFilter(baseFilters);
    }

    if (endDate && endDate.isValid()) {
      return setRecurrenceFilter({
        ...baseFilters,
        endDate: endDate.format('YYYY-MM-DD'),
      });
    }

    const endsAfter = Number(occurrences);

    if (endsAfter && endsAfter > 0) {
      return setRecurrenceFilter({
        ...baseFilters,
        occurrences: endsAfter,
      });
    }

    return setRecurrenceFilter(null);
  }, [
    setRecurrenceFilter,
    allDayEvent,
    startDate,
    startTime,
    endTime,
    recurrenceEnum,
    occurrences,
    endDate,
  ]);

  return debouncedRecurrenceFilter;
};
