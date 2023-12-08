import { TFunction } from '@tyro/i18n';
import { Sa_SchoolActivityDate } from '@tyro/api';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

export function formatActivityDates(
  t: TFunction<'schoolActivities'[], undefined, 'schoolActivities'[]>,
  dates: Sa_SchoolActivityDate[]
) {
  if (dates?.length > 1) {
    return dates.map((date) => dayjs(date.date).format('LL')).join(', ');
  }
  const singleDate = dates[0];
  const dayOfWeek = dayjs(singleDate.date).format('LL');
  const startTime = singleDate.startTime ?? '-';
  const endTime = singleDate.endTime ?? '-';
  if (singleDate.partial) {
    return `${dayOfWeek}, ${startTime} - ${endTime}`;
  }
  return dayjs(singleDate?.date).format('LL');
}
