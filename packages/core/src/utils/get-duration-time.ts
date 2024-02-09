import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { TFunction } from '@tyro/i18n';

dayjs.extend(duration);

export const getHumanizedTime = (minutes: number, t: TFunction<'common'>) => {
  const timeDuration = dayjs.duration(minutes, 'minutes');

  if (timeDuration.asYears() >= 1) {
    return t('timePostfix.year', { year: Math.floor(timeDuration.asYears()) });
  }

  if (timeDuration.asMonths() >= 1) {
    return t('timePostfix.month', {
      month: Math.floor(timeDuration.asMonths()),
    });
  }

  if (timeDuration.asWeeks() >= 1) {
    return t('timePostfix.week', { week: Math.floor(timeDuration.asWeeks()) });
  }

  if (timeDuration.asDays() >= 1) {
    return t('timePostfix.day', { day: Math.floor(timeDuration.asDays()) });
  }

  if (timeDuration.asHours() >= 1) {
    return t('timePostfix.hour', { hour: Math.floor(timeDuration.asHours()) });
  }

  return t('timePostfix.minute', { minute: minutes });
};
