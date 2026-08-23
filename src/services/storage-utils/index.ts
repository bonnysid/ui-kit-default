import { BrowserStorage } from './browser-storage';
import { KEY_SEPARATOR } from './constants';

export { deserializeStorageValue, serializeStorageValue } from './serialization';

export type {
  BrowserStorageOptions,
  RawValue,
  StorageChange,
  StorageChangeListener,
  StorageFailure,
  StorageReadResult,
  StorageResult,
  StorageSuccess,
  StorageType,
} from './types';

export const localStorageClient = new BrowserStorage('localStorage');

export const sessionStorageClient = new BrowserStorage('sessionStorage');

export { BrowserStorage, KEY_SEPARATOR };
