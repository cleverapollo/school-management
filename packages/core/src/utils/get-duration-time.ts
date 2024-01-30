import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { TFunction } from '@tyro/i18n';

dayjs.extend(duration);

export const getHumanizedTime = (minutes: number, t: TFunction<'common'>) => {
  const timeDuration = dayjs.duration(minutes, 'minutes');

  if (timeDuration.asYears() >= 1) {
    return `${Math.floor(timeDuration.asYears())}${t('timePostfix.year')}`;
  }
  if (timeDuration.asMonths() >= 1) {
    return `${Math.floor(timeDuration.asMonths())}${t('timePostfix.month')}`;
  }
  if (timeDuration.asWeeks() >= 1) {
    return `${Math.floor(timeDuration.asYears())}${t('timePostfix.week')}`;
  }
  if (timeDuration.asDays() >= 1) {
    return `${Math.floor(timeDuration.asDays())}${t('timePostfix.day')}`;
  }
  if (timeDuration.asHours() >= 1) {
    return `${Math.floor(timeDuration.asHours())}${t('timePostfix.hour')}`;
  }
  return `${minutes}${t('timePostfix.minute')}`;
};
