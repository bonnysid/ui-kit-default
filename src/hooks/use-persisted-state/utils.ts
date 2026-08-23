import type { PersistedStateAction } from './types';

export const isFunctionUpdater = <T>(next: PersistedStateAction<T>): next is (prev: T) => T => {
  return typeof next === 'function';
};
