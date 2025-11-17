import { useEffect, useRef, useState } from 'react';

const useDebounce = <T>(value: T, delay = 0) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<number>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, value]);

  return debouncedValue;
};

export { useDebounce };
