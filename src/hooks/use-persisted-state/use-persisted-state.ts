import { useRef, useSyncExternalStore } from 'react';
import { BrowserStorage, StorageType } from '@/services/storage-utils';
import { PersistedStore } from './persisted-store';
import type { UsePersistedStateOptions, UsePersistedStateResult } from './types';

type StoreRecord<T> = {
  key: string;
  storageType: StorageType;
  store: PersistedStore<T>;
  prefix?: string;
};

export const usePersistedState = <T>({
  key,
  storageType = 'localStorage',
  initialValue,
  prefix,
}: UsePersistedStateOptions<T>): UsePersistedStateResult<T> => {
  const storeRef = useRef<StoreRecord<T> | null>(null);

  if (
    !storeRef.current ||
    storeRef.current.key !== key ||
    storeRef.current.storageType !== storageType ||
    storeRef.current?.prefix !== prefix
  ) {
    storeRef.current = {
      key,
      storageType,
      store: new PersistedStore<T>(key, initialValue, new BrowserStorage(storageType, { prefix })),
      prefix,
    };
  }

  const store = storeRef.current.store;

  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return [state, store.setState, store.actions] as const;
};
