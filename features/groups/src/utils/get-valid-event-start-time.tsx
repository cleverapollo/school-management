import dayjs from 'dayjs';

const format = 'YYYY-MM-DDTHH:mm';

export const getValidEventStartTime = (
  eventStartTime: string | undefined | null
) => {
  const isValid = dayjs(eventStartTime, format).isValid();
  const startTime = isValid ? eventStartTime : dayjs();

  return dayjs(startTime).format(format);
};
