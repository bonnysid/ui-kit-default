import { KEY_SEPARATOR } from './constants';
import { deserializeStorageValue, serializeStorageValue } from './serialization';
import type {
  BrowserStorageOptions,
  StorageChangeListener,
  StorageReadResult,
  StorageResult,
  StorageType,
  Unsubscribe,
} from './types';

const resolveStorage = (storageType: StorageType): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window[storageType];
  } catch (e) {
    return null;
  }
};

export class BrowserStorage {
  public readonly storageType: StorageType;
  public readonly prefix?: string;

  constructor(storageType: StorageType, options: BrowserStorageOptions = {}) {
    this.storageType = storageType;
    this.prefix = options.prefix;
  }

  private getStorage(): Storage {
    const storage = resolveStorage(this.storageType);

    if (!storage) {
      throw new Error(`${this.storageType} is unavailable`);
    }

    return storage;
  }

  public getKey(key: string) {
    if (!this.prefix) {
      return key;
    }

    return [this.prefix, key].join(KEY_SEPARATOR);
  }

  public readRaw(key: string): StorageResult<string | null> {
    try {
      const storage = this.getStorage();

      return {
        ok: true,
        data: storage.getItem(this.getKey(key)),
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  public writeRaw(key: string, rawValue: string): StorageResult<void> {
    try {
      const storage = this.getStorage();

      storage.setItem(this.getKey(key), rawValue);

      return {
        ok: true,
        data: undefined,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  public get<T>(key: string): StorageReadResult<T> {
    const result = this.readRaw(key);

    if (!result.ok) {
      return result;
    }

    if (result.data === null) {
      return {
        ok: true,
        data: {
          value: null,
          rawValue: null,
        },
      };
    }

    try {
      return {
        ok: true,
        data: {
          value: deserializeStorageValue<T>(result.data),
          rawValue: result.data,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  public set<T>(key: string, value: T): StorageResult<void> {
    try {
      const rawValue = serializeStorageValue<T>(value);

      return this.writeRaw(key, rawValue);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  public remove(key: string): StorageResult<void> {
    try {
      const storage = this.getStorage();

      storage.removeItem(this.getKey(key));

      return {
        ok: true,
        data: undefined,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  public clear(keys?: string[]) {
    try {
      const storage = this.getStorage();

      if (keys?.length) {
        keys.forEach((key) => {
          storage.removeItem(this.getKey(key));
        });
      } else if (!this.prefix) {
        storage.clear();
      } else {
        const prefix = `${this.prefix}${KEY_SEPARATOR}`;

        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);

          if (key?.startsWith(prefix)) {
            storage.removeItem(key);
          }
        }
      }

      return {
        ok: true,
        data: undefined,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  public has(key: string): boolean {
    const result = this.readRaw(key);

    return result.ok && result.data !== null;
  }

  public getValue<T>(key: string): T | undefined {
    const result = this.get<T>(key);

    if (!result.ok) {
      return undefined;
    }

    if (result.data.rawValue === null) {
      return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- расчитываем что там действительно T
    return result.data.value as T;
  }

  public subscribe(key: string, listener: StorageChangeListener): Unsubscribe {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const physicalKey = this.getKey(key);

    const handler = (event: StorageEvent) => {
      try {
        const storage = this.getStorage();

        if (event.storageArea !== storage) {
          return;
        }
      } catch {
        return;
      }

      if (event.key === null) {
        listener({
          key: physicalKey,
          oldValue: null,
          newValue: null,
        });

        return;
      }

      if (event.key !== physicalKey) {
        return;
      }

      listener({
        key: physicalKey,
        oldValue: event.oldValue,
        newValue: event.newValue,
      });
    };

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  }
}
