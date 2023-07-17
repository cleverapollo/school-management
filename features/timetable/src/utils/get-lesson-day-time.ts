import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { getLocaleTimestamp } from '@tyro/core';
import { Lesson } from '../hooks/use-resource-table';

dayjs.extend(LocalizedFormat);

type DayAndTimeArgs = Pick<Lesson, 'timeslotId' | 'timeslotInfo'>;

export function getLessonDayAndTime({
  timeslotId,
  timeslotInfo,
}: DayAndTimeArgs) {
  const day = dayjs().set('day', timeslotId?.dayIdx ?? 0);
  const time = getLocaleTimestamp(timeslotInfo?.startTime);
  return {
    day,
    time,
  };
}

export function getShortLessonDayTime(lesson: DayAndTimeArgs) {
  const { day, time } = getLessonDayAndTime(lesson);
  return day && time ? `${day.format('ddd')}, ${time}` : undefined;
}
