import { useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import dayjs from 'dayjs';

const activityKey = 'tyro:last-activity';

const onActivity = throttle(() => {
  localStorage.setItem(activityKey, String(dayjs().unix()));
}, 30000);

export function useIdleTracker(maxIdleMinutes: number) {
  const [isIdle, setIsIdle] = useState(false);
  const [isPastIdle, setIsPastIdle] = useState(false);

  useEffect(() => {
    window.addEventListener('mousemove', onActivity);
    window.addEventListener('keydown', onActivity);
    window.addEventListener('scroll', onActivity);

    const checker = setInterval(() => {
      const lastActivity = localStorage.getItem(activityKey);
      if (!lastActivity) {
        return;
      }

      const idleMinutes = dayjs().diff(dayjs.unix(Number(lastActivity)), 'm');
      if (idleMinutes >= maxIdleMinutes - 2) {
        setIsIdle(true);
      }

      if (idleMinutes >= maxIdleMinutes) {
        setIsPastIdle(true);
      }
    }, 60000);

    return () => {
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('scroll', onActivity);
      clearInterval(checker);
    };
  }, []);

  return {
    isIdle,
    isPastIdle,
    resetActivity: () => {
      setIsIdle(false);
      onActivity();
    },
  };
}
