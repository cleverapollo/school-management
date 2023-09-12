import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

export function getRelativeDateFormat(dateAndTime: string) {
  const time = dayjs(dateAndTime);

  if (time.isSame(dayjs(), 'day')) {
    return time.format('LT');
  }

  if (time.isSame(dayjs(), 'year')) {
    return time.format('MMM D');
  }

  return time.format('l');
}
