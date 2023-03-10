import dayjs from 'dayjs';
import { UseQueryReturnType } from '@tyro/api';
import { usePartyTimetable, useTimetableDayInfo } from '../api/timetable';

type TimetableData = UseQueryReturnType<typeof usePartyTimetable>;

export function useTimetableInPeriods(
  date: dayjs.Dayjs,
  data: TimetableData | undefined
) {
  const { data: timetableDayInfo } = useTimetableDayInfo(date);

  const timetableDataAsObject = data?.reduce<
    Record<string, TimetableData[number]>
  >((acc, event) => {
    if (event.startTime && event.endTime) {
      const key = `${event.startTime}-${event.endTime}`;
      acc[key] = event;
    }
    return acc;
  }, {});

  console.log({
    timetableDayInfo,
    data,
  });

  return {
    ...timetableDayInfo,
    periods: timetableDayInfo?.periods?.map((period) => {
      const key = `${period.startTime}-${period.endTime}`;
      return {
        ...period,
        event: timetableDataAsObject?.[key],
      };
    }),
  };
}
