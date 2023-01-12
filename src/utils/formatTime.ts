import { format, getTime, formatDistanceToNow } from 'date-fns';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export function fDate(date: Date | string | number) {
  return dayjs(date).format('D MMMM YYYY');
}

export function fDateTime(date: Date | string | number) {
  return format(new Date(date), 'dd MMM yyyy p');
}

export function fTimestamp(date: Date | string | number) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date: Date | string | number) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date: Date | string | number) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export const localDateStringToCalendarDate = (date: string) => {
  return dayjs(date).format('YYYY-DD-MM');
}
