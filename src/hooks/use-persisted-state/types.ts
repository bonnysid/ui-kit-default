import { RawValue, StorageType } from '@/services/storage-utils';
import type { UNSET } from './constants';

export type PersistedStateAction<T> = T | ((prev: T) => T);

export type PersistedStateSetter<T> = (action: PersistedStateAction<T>) => void;

export type PersistedStateActions = {
  reset: () => void;
};

export type UsePersistedStateOptions<T> = {
  key: string;
  initialValue: T;
  storageType?: StorageType;
};

export type UsePersistedStateResult<T> = readonly [
  state: T,
  setState: PersistedStateSetter<T>,
  actions: PersistedStateActions,
];

export type Listener = () => void;

export type Unsubscribe = () => void;

export type CustomEventListener = (e: Event) => void;

export type StorageEventListener = (e: StorageEvent) => void;

export type PersistedStateChange = {
  sourceId: symbol;

  key: string;
  storageType: StorageType;
  rawValue: string | null;

  persisted: boolean;
};

export type PersistedStateEvents = {
  change: PersistedStateChange;
};

export type CachedRawValue = RawValue | typeof UNSET;

export type MemoryOverride = RawValue | typeof UNSET;
