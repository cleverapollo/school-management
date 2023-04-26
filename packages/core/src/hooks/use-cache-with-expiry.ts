import { useUser } from '@tyro/api';
import dayjs from 'dayjs';
import { SetStateAction, useState } from 'react';
import { useLocation } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

interface UseCacheWithExpiryOptions {
  staleTime?: number;
}

// one day in ms
const DEFAULT_CACHE = 1000 * 60 * 60 * 24;

function isValueEmpty<T>(value: T) {
  switch (typeof value) {
    case 'boolean':
    case 'number':
      return false;
    default:
      return isEmpty(value);
  }
}

function setInLocalStorage<T>(
  cacheKey: string,
  newValue: T,
  options?: UseCacheWithExpiryOptions
) {
  if (isValueEmpty<T>(newValue)) {
    localStorage.removeItem(cacheKey);
  } else {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        expires: dayjs()
          .add(options?.staleTime ?? DEFAULT_CACHE, 'ms')
          .toISOString(),
        data: newValue,
      })
    );
  }
}

function getFromLocalStorage<T>(cacheKey: string) {
  const storedValue = localStorage.getItem(cacheKey);

  if (storedValue === null) {
    return undefined;
  }

  const { expires, data } = JSON.parse(storedValue) as {
    expires: string;
    data: T;
  };

  const expiredDate = dayjs(expires);
  if (!expiredDate.isValid() || expiredDate.isBefore(dayjs())) {
    localStorage.removeItem(cacheKey);

    return undefined;
  }

  return data;
}

export function useCacheWithExpiry<T = unknown>(
  key: string,
  defaultValue: T,
  options?: UseCacheWithExpiryOptions
) {
  const { activeProfile } = useUser();
  const location = useLocation();
  const cacheKey = `tyro:${activeProfile?.id ?? 0}:${key}:${location.pathname}`;
  const [isInitialized, setIsInitialized] = useState(false);
  const [value, setValue] = useState<T>(() => {
    const storedValue = getFromLocalStorage<T>(cacheKey);

    setIsInitialized(true);
    if (storedValue !== undefined) {
      return storedValue;
    }

    setInLocalStorage(cacheKey, defaultValue, options);
    return defaultValue;
  });

  const setCachedValue = (newValue: SetStateAction<T>) => {
    setValue((currentValue: T) => {
      const result =
        typeof newValue === 'function'
          ? // @ts-expect-error
            (newValue(currentValue) as T)
          : newValue;

      setInLocalStorage<T>(cacheKey, result, options);

      return result;
    });
  };

  return [value, setCachedValue, isInitialized] as const;
}
