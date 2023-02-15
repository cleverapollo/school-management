import { useEffect, useState } from 'react';

interface UseDebouncedValueProps<T> {
  defaultValue?: T;
  delay?: number;
}

export function useDebouncedValue<T>({
  defaultValue = undefined as T,
  delay = 150,
}: UseDebouncedValueProps<T>) {
  const [value, setValue] = useState<T>(defaultValue);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return {
    setValue,
    value,
    debouncedValue,
  };
}
