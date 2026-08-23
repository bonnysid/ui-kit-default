export type StorageType = 'localStorage' | 'sessionStorage';

export type StorageSuccess<T> = {
  ok: true;
  data: T;
};

export type StorageFailure = {
  ok: false;
  error: unknown;
};

export type StorageResult<T> = StorageSuccess<T> | StorageFailure;

export type RawValue = string | null;

export type StorageReadResult<T> = StorageResult<{ value: T | null; rawValue: RawValue }>;

export type StorageChange = {
  key: string;
  oldValue: RawValue;
  newValue: RawValue;
};

export type StorageChangeListener = (change: StorageChange) => void;

export type Unsubscribe = () => void;

export type BrowserStorageOptions = {
  prefix?: string;
};
