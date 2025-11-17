import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from 'react';

type Initializer<T> = T | (() => T);

export type UsePersistedStateProps<T> = {
  key: string;
  initialValue: Initializer<T>;
  storage?: Storage;
};

export type UsePersistedStateReturn<T> = [T, Dispatch<SetStateAction<T>>];

const DEFAULT_STORAGE = typeof window !== 'undefined' ? window.localStorage : undefined;
const STORAGE_EVENT_NAME = '__use-persisted-state__';

const safeParse = <T>(value: string | null): T | undefined => {
  if (value === null) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const usePersistedState = <T>({
  key,
  initialValue,
  storage = DEFAULT_STORAGE,
}: UsePersistedStateProps<T>): UsePersistedStateReturn<T> => {
  const isFirst = useRef(true);
  const storageRef = useRef<Storage | undefined>(storage);

  useEffect(() => {
    storageRef.current = storage;
  }, [storage]);

  const [state, setState] = useState<T>(() => {
    const s = storageRef.current;
    if (!s) {
      return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    }

    const fromStorage = safeParse<T>(s.getItem(key));
    if (fromStorage !== undefined) return fromStorage;

    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  });

  useIsomorphicLayoutEffect(() => {
    const s = storageRef.current;
    if (!s) return;

    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    try {
      s.setItem(key, JSON.stringify(state));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent(STORAGE_EVENT_NAME, {
            detail: { key, value: state },
          }),
        );
      }
    } catch {
      // ignore
    }
  }, [key, state]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCustom = (e: Event) => {
      const ce = e as CustomEvent<{ key: string; value: T }>;
      if (ce.detail?.key !== key) return;
      const next = ce.detail.value;

      setState((prev) => {
        const prevStr = JSON.stringify(prev);
        const nextStr = JSON.stringify(next);
        return prevStr === nextStr ? prev : next;
      });
    };

    window.addEventListener(STORAGE_EVENT_NAME, handleCustom);

    return () => {
      window.removeEventListener(STORAGE_EVENT_NAME, handleCustom);
    };
  }, [key]);

  useEffect(() => {
    const s = storageRef.current;
    if (!s) return;
    const fromStorage = safeParse<T>(s.getItem(key));
    if (fromStorage !== undefined) {
      setState((prev) => {
        const prevStr = JSON.stringify(prev);
        const nextStr = JSON.stringify(fromStorage);
        return prevStr === nextStr ? prev : fromStorage;
      });
    }
  }, [key]);

  return [state, setState];
};
