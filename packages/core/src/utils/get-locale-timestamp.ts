import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

export function getLocaleTimestamp(timestamp: string | null | undefined) {
  const [hour, minute] = timestamp?.split(':') ?? [];
  return hour && minute
    ? dayjs().hour(Number(hour)).minute(Number(minute)).format('LT')
    : '';
}
