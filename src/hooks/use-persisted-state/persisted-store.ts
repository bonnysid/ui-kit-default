import {
  BrowserStorage,
  deserializeStorageValue,
  RawValue,
  StorageChange,
  serializeStorageValue,
} from '@/services/storage-utils';
import { READ_ERROR, UNSET } from './constants';
import { persistedStateEvents } from './persisted-state-events';
import type {
  CachedRawValue,
  Listener,
  MemoryOverride,
  PersistedStateActions,
  PersistedStateChange,
  PersistedStateSetter,
  Unsubscribe,
} from './types';
import { isFunctionUpdater } from './utils';

export class PersistedStore<T> {
  private readonly id = Symbol('persisted-store');
  private readonly physicalKey: string;
  private readonly initialRawValue: string;
  private readonly listeners = new Set<Listener>();
  private unsubscribeWindowEvents: Listener | null = null;
  private unsubscribeStorageEvent: Listener | null = null;
  private cachedRawValue: CachedRawValue = UNSET;
  private cacheValue: T;
  private memoryOverride: MemoryOverride = UNSET;

  constructor(
    private readonly key: string,
    private readonly initialValue: T,
    private readonly storage: BrowserStorage,
  ) {
    this.cacheValue = initialValue;

    this.physicalKey = storage.getKey(key);

    this.initialRawValue = serializeStorageValue(initialValue);
  }

  public subscribe = (listener: Listener): Unsubscribe => {
    this.listeners.add(listener);

    if (this.listeners.size === 1) {
      this.start();
    }

    return () => {
      this.listeners.delete(listener);

      if (this.listeners.size === 0) {
        this.stop();
      }
    };
  };

  public getSnapshot = (): T => {
    const rawValue = this.readCurrentRawValue();

    if (rawValue === READ_ERROR) {
      return this.cacheValue;
    }

    this.updateCache(rawValue);

    return this.cacheValue;
  };

  public getServerSnapshot = (): T => {
    return this.initialValue;
  };

  public setState: PersistedStateSetter<T> = (action) => {
    const prevState = this.getSnapshot();

    const nextState = isFunctionUpdater(action) ? action(prevState) : action;

    const rawValue = serializeStorageValue(nextState);

    this.commit(rawValue);
  };

  public reset = (): void => {
    this.commit(this.initialRawValue);
  };

  readonly actions: PersistedStateActions = {
    reset: this.reset,
  };

  private start(): void {
    this.unsubscribeWindowEvents = persistedStateEvents.subscribe(
      'change',
      this.handleWindowChange,
    );

    this.unsubscribeStorageEvent = this.storage.subscribe(this.key, this.handleStorageChange);

    this.initialize();
  }

  private stop(): void {
    this.unsubscribeWindowEvents?.();
    this.unsubscribeStorageEvent?.();

    this.unsubscribeWindowEvents = null;
    this.unsubscribeStorageEvent = null;
  }

  private initialize(): void {
    const result = this.storage.readRaw(this.key);

    if (!result.ok) {
      return;
    }

    const rawValue = result.data;

    if (rawValue === null) {
      this.persistInitialValue();

      return;
    }

    try {
      deserializeStorageValue<T>(rawValue);

      this.updateCache(rawValue);
    } catch {
      this.persistInitialValue();
    }
  }

  private persistInitialValue(): void {
    this.commit(this.initialRawValue);
  }

  private commit(rawValue: string) {
    const result = this.storage.writeRaw(this.key, rawValue);

    if (result.ok) {
      this.memoryOverride = UNSET;
    } else {
      this.memoryOverride = rawValue;
    }

    const changed = this.updateCache(rawValue);

    if (changed) {
      this.notify();
    }

    this.publishChange(rawValue, result.ok);
  }

  private publishChange(rawValue: RawValue, persisted: boolean) {
    persistedStateEvents.dispatch('change', {
      sourceId: this.id,
      key: this.physicalKey,
      storageType: this.storage.storageType,
      rawValue,
      persisted,
    });
  }

  private handleWindowChange = (change: PersistedStateChange) => {
    if (change.sourceId === this.id) {
      return;
    }

    if (change.storageType !== this.storage.storageType) {
      return;
    }

    if (change.key !== this.physicalKey) {
      return;
    }

    if (change.persisted) {
      this.memoryOverride = UNSET;
    } else {
      this.memoryOverride = change.rawValue;
    }

    if (this.updateCache(change.rawValue)) {
      this.notify();
    }
  };

  private handleStorageChange = (change: StorageChange) => {
    if (change.key !== null && change.key !== this.physicalKey) {
      return;
    }

    this.memoryOverride = UNSET;

    if (this.updateCache(change.newValue)) {
      this.notify();
    }
  };

  private readCurrentRawValue(): RawValue | typeof READ_ERROR {
    if (this.memoryOverride !== UNSET) {
      return this.memoryOverride;
    }

    const result = this.storage.readRaw(this.key);

    if (!result.ok) {
      return READ_ERROR;
    }

    return result.data;
  }

  private updateCache(rawValue: RawValue): boolean {
    if (this.cachedRawValue !== UNSET && this.cachedRawValue === rawValue) {
      return false;
    }

    this.cachedRawValue = rawValue;

    if (rawValue === null) {
      this.cacheValue = this.initialValue;

      return true;
    }

    try {
      this.cacheValue = deserializeStorageValue<T>(rawValue);
    } catch {
      this.cacheValue = this.initialValue;
    }

    return true;
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}
