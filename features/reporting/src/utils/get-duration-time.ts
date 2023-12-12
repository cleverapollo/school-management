import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const getHumanizedTime = (minutes: number) => {
  const timeDuration = dayjs.duration(minutes, 'minutes');

  if (timeDuration.asYears() >= 1) {
    return `${Math.floor(timeDuration.asYears())}y`;
  }
  if (timeDuration.asMonths() >= 1) {
    return `${Math.floor(timeDuration.asMonths())}mo`;
  }
  if (timeDuration.asWeeks() >= 1) {
    return `${Math.floor(timeDuration.asYears())}w`;
  }
  if (timeDuration.asDays() >= 1) {
    return `${Math.floor(timeDuration.asDays())}d`;
  }
  if (timeDuration.asHours() >= 1) {
    return `${Math.floor(timeDuration.asHours())}h`;
  }
  return minutes;
};
