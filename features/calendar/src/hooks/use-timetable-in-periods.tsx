import { useMemo } from 'react';
import dayjs from 'dayjs';
import {
  CalendarGridPeriodInfo,
  CalendarGridPeriodType,
  UseQueryReturnType,
} from '@tyro/api';
import { usePartyTimetable, useTimetableDayInfo } from '../api/timetable';

type TimetableData = UseQueryReturnType<typeof usePartyTimetable>;

export function useTimetableInPeriods(
  date: dayjs.Dayjs,
  data: TimetableData | undefined
) {
  const { data: timetableDayInfo } = useTimetableDayInfo(date);

  return useMemo(() => {
    const usedEventIds = new Set<number>();

    const periodsInSchoolTime = (timetableDayInfo?.periods ?? []).reduce<
      (CalendarGridPeriodInfo & { event: TimetableData[number] | null })[]
    >((acc, period) => {
      const eventsAtPeriodStart = (data ?? [])
        .filter((event) => event.startTime === period.startTime)
        .map((event) => {
          usedEventIds.add(event.eventId);
          return {
            ...period,
            event,
          };
        });

      if (
        Array.isArray(eventsAtPeriodStart) &&
        eventsAtPeriodStart.length > 0
      ) {
        acc.push(...eventsAtPeriodStart);
      } else {
        acc.push({
          ...period,
          event: null,
        });
      }

      return acc;
    }, []);

    const unusedEventsDuringSchoolDay = data?.filter(
      ({ eventId, startTime }) => {
        const eventStartTime = dayjs(startTime);

        return (
          !usedEventIds.has(eventId) &&
          eventStartTime.isAfter(timetableDayInfo?.startTime) &&
          eventStartTime.isBefore(timetableDayInfo?.endTime)
        );
      }
    );
    unusedEventsDuringSchoolDay?.forEach((event) => {
      const eventStartTime = dayjs(event.startTime);

      const periodToPlaceEventBefore = periodsInSchoolTime.findIndex(
        (period) => {
          const periodStartTime = dayjs(period.startTime);
          return eventStartTime.isBefore(periodStartTime);
        }
      );

      if (periodToPlaceEventBefore !== -1) {
        periodsInSchoolTime.splice(periodToPlaceEventBefore, 0, {
          type: CalendarGridPeriodType.Class,
          startTime: event.startTime,
          endTime: event.endTime,
          event,
        });
      }
    });

    const eventsBeforeSchool = (data ?? [])
      .filter((event) => {
        const startTime = dayjs(event.startTime);
        return startTime.isBefore(timetableDayInfo?.startTime);
      })
      .map((event) => ({
        type: CalendarGridPeriodType.Class,
        startTime: event.startTime,
        endTime: event.endTime,
        event,
      }));

    const eventsAfterSchool = (data ?? [])
      .filter((event) => {
        const startTime = dayjs(event.startTime);
        return startTime.isAfter(timetableDayInfo?.endTime);
      })
      .map((event) => ({
        type: CalendarGridPeriodType.Class,
        startTime: event.startTime,
        endTime: event.endTime,
        event,
      }));

    return {
      ...timetableDayInfo,
      periods: [
        ...eventsBeforeSchool,
        ...periodsInSchoolTime,
        ...eventsAfterSchool,
      ],
      numberOfEventsBeforeSchool: eventsBeforeSchool.length,
      numberOfEventsAfterSchool: eventsAfterSchool.length,
    };
  }, [timetableDayInfo, data]);
}
