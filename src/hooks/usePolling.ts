import { useCallback, useEffect, useRef } from 'react';

export type UsePollingProps = {
  callback: () => void;
  interval?: number;
  startImmediately?: boolean;
};

export const usePolling = ({ callback, interval = 10_000, startImmediately }: UsePollingProps) => {
  const intervalRef = useRef<number>(0);

  const start = useCallback(() => {
    intervalRef.current = window.setInterval(callback, interval);
  }, [callback, interval]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = 0;
    }
  }, []);

  useEffect(() => {
    if (startImmediately) {
      start();
    }
    return () => stop();
  }, []);

  return { start, stop };
};
