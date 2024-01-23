import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { CalendarEvent } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);
dayjs.extend(calendar);

export function useFormatLessonTime({
  startTime,
  endTime,
}: Pick<CalendarEvent, 'startTime' | 'endTime'>) {
  const { t } = useTranslation(['calendar']);

  if (!startTime) return '-';

  const initialHour = dayjs(startTime).calendar(null, {
    sameDay: `[${t('calendar:today')}], HH:mm`,
    nextDay: `[${t('calendar:tomorrow')}], HH:mm`,
    nextWeek: 'dddd, HH:mm',
    lastDay: `[${t('calendar:yesterday')}], HH:mm`,
    lastWeek: `[${t('calendar:dayOfLastWeek', {
      day: dayjs(startTime).format('dddd, HH:mm'),
    })}]`,
    sameElse: 'l, HH:mm',
  });
  
  const endHour = dayjs(endTime).format('HH:mm');

  return `${initialHour} - ${endHour}`;
}
