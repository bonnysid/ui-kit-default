/**
 * @jest-environment node
 */

import { BrowserStorage } from 'src/services/storage-utils';
import { PersistedStore } from '../persisted-store';

describe('PersistedStore в SSR окружении', () => {
  test('getServerSnapshot возвращает initialValue', () => {
    const initialValue = {
      page: 1,
    };

    const store = new PersistedStore('settings', initialValue, new BrowserStorage('localStorage'));

    expect(store.getServerSnapshot()).toBe(initialValue);
  });

  test('getSnapshot возвращает initialValue при отсутствии browser storage', () => {
    const store = new PersistedStore('counter', 42, new BrowserStorage('localStorage'));

    expect(store.getSnapshot()).toBe(42);
  });

  test('getSnapshot сохраняет reference initial object', () => {
    const initialValue = {
      page: 1,
    };

    const store = new PersistedStore('settings', initialValue, new BrowserStorage('localStorage'));

    expect(store.getSnapshot()).toBe(initialValue);

    expect(store.getSnapshot()).toBe(initialValue);
  });

  test('subscribe не падает при отсутствии window', () => {
    const store = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

    expect(() => {
      const unsubscribe = store.subscribe(jest.fn());

      unsubscribe();
    }).not.toThrow();
  });

  test('setState продолжает работать как in-memory state', () => {
    const store = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

    const listener = jest.fn();

    const unsubscribe = store.subscribe(listener);

    listener.mockClear();

    store.setState(42);

    expect(store.getSnapshot()).toBe(42);

    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  test('поддерживает functional updater без browser окружения', () => {
    const store = new PersistedStore('counter', 10, new BrowserStorage('localStorage'));

    const unsubscribe = store.subscribe(jest.fn());

    store.setState((prev) => prev + 5);

    expect(store.getSnapshot()).toBe(15);

    unsubscribe();
  });

  test('reset возвращает initialValue без browser окружения', () => {
    const store = new PersistedStore('counter', 5, new BrowserStorage('localStorage'));

    const unsubscribe = store.subscribe(jest.fn());

    store.setState(100);

    expect(store.getSnapshot()).toBe(100);

    store.reset();

    expect(store.getSnapshot()).toBe(5);

    unsubscribe();
  });

  test('не падает при использовании sessionStorage', () => {
    const store = new PersistedStore('counter', 5, new BrowserStorage('sessionStorage'));

    expect(() => {
      const unsubscribe = store.subscribe(jest.fn());

      store.setState(42);

      unsubscribe();
    }).not.toThrow();

    expect(store.getSnapshot()).toBe(42);
  });
});
