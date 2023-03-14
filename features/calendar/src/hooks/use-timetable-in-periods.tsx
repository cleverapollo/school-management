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

  const periodsInSchoolTime = (timetableDayInfo?.periods ?? []).reduce<
    (CalendarGridPeriodInfo & { event: TimetableData[number] | null })[]
  >((acc, period) => {
    const eventsAtPeriodStart = (data ?? [])
      .filter((event) => event.startTime === period.startTime)
      .map((event) => ({
        ...period,
        event,
      }));

    if (Array.isArray(eventsAtPeriodStart) && eventsAtPeriodStart.length > 0) {
      acc.push(...eventsAtPeriodStart);
    } else {
      acc.push({
        ...period,
        event: null,
      });
    }

    return acc;
  }, []);

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
}
