/**
 * @jest-environment jsdom
 */

import { BrowserStorage } from '@/services/storage-utils';
import { PersistedStore } from '../persisted-store';

describe('PersistedStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();

    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  describe('getSnapshot', () => {
    test('возвращает initialValue, если значение отсутствует в storage', () => {
      const store = new PersistedStore('counter', 5, new BrowserStorage('localStorage'));

      expect(store.getSnapshot()).toBe(5);
    });

    test('возвращает persisted значение вместо initialValue', () => {
      window.localStorage.setItem('counter', '42');

      const store = new PersistedStore('counter', 5, new BrowserStorage('localStorage'));

      expect(store.getSnapshot()).toBe(42);
    });

    test('возвращает тот же reference объекта, пока raw значение не изменилось', () => {
      window.localStorage.setItem(
        'settings',
        JSON.stringify({
          page: 1,
          filters: ['active'],
        }),
      );

      const store = new PersistedStore(
        'settings',
        {
          page: 0,
          filters: [],
        },
        new BrowserStorage('localStorage'),
      );

      const first = store.getSnapshot();

      const second = store.getSnapshot();

      expect(second).toBe(first);
    });

    test('возвращает новый reference объекта после изменения raw значения', () => {
      window.localStorage.setItem(
        'settings',
        JSON.stringify({
          page: 1,
        }),
      );

      const store = new PersistedStore(
        'settings',
        {
          page: 0,
        },
        new BrowserStorage('localStorage'),
      );

      const first = store.getSnapshot();

      window.localStorage.setItem(
        'settings',
        JSON.stringify({
          page: 2,
        }),
      );

      const second = store.getSnapshot();

      expect(second).not.toBe(first);

      expect(second).toEqual({
        page: 2,
      });
    });

    test('не создаёт новый reference при записи того же raw значения', () => {
      const rawValue = JSON.stringify({
        page: 1,
      });

      window.localStorage.setItem('settings', rawValue);

      const store = new PersistedStore(
        'settings',
        {
          page: 0,
        },
        new BrowserStorage('localStorage'),
      );

      const first = store.getSnapshot();

      window.localStorage.setItem('settings', rawValue);

      const second = store.getSnapshot();

      expect(second).toBe(first);
    });

    test('корректно различает отсутствующее значение и сохранённый null', () => {
      window.localStorage.setItem('value', 'null');

      const store = new PersistedStore<number | null>(
        'value',
        42,
        new BrowserStorage('localStorage'),
      );

      expect(store.getSnapshot()).toBeNull();
    });
  });

  describe('инициализация', () => {
    test('сохраняет initialValue при первой подписке, если ключ отсутствует', () => {
      const store = new PersistedStore('counter', 5, new BrowserStorage('localStorage'));

      const unsubscribe = store.subscribe(jest.fn());

      expect(window.localStorage.getItem('counter')).toBe('5');

      unsubscribe();
    });

    test('не перезаписывает существующее persisted значение при инициализации', () => {
      window.localStorage.setItem('counter', '42');

      const store = new PersistedStore('counter', 5, new BrowserStorage('localStorage'));

      const unsubscribe = store.subscribe(jest.fn());

      expect(window.localStorage.getItem('counter')).toBe('42');

      expect(store.getSnapshot()).toBe(42);

      unsubscribe();
    });

    test('восстанавливает initialValue при повреждённом persisted JSON', () => {
      window.localStorage.setItem('settings', '{invalid');

      const store = new PersistedStore(
        'settings',
        {
          page: 1,
        },
        new BrowserStorage('localStorage'),
      );

      const unsubscribe = store.subscribe(jest.fn());

      expect(store.getSnapshot()).toEqual({
        page: 1,
      });

      expect(window.localStorage.getItem('settings')).toBe(
        JSON.stringify({
          page: 1,
        }),
      );

      unsubscribe();
    });
  });

  describe('setState', () => {
    test('обновляет snapshot и storage', () => {
      const store = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const unsubscribe = store.subscribe(jest.fn());

      store.setState(42);

      expect(store.getSnapshot()).toBe(42);

      expect(window.localStorage.getItem('counter')).toBe('42');

      unsubscribe();
    });

    test('поддерживает functional updater', () => {
      const store = new PersistedStore('counter', 10, new BrowserStorage('localStorage'));

      const unsubscribe = store.subscribe(jest.fn());

      store.setState((prev) => prev + 5);

      expect(store.getSnapshot()).toBe(15);

      expect(window.localStorage.getItem('counter')).toBe('15');

      unsubscribe();
    });

    test('functional updater получает актуальное persisted состояние', () => {
      window.localStorage.setItem('counter', '10');

      const store = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const unsubscribe = store.subscribe(jest.fn());

      store.setState((prev) => prev + 5);

      expect(store.getSnapshot()).toBe(15);

      unsubscribe();
    });

    test('уведомляет подписчиков после изменения состояния', () => {
      const store = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const listener = jest.fn();

      const unsubscribe = store.subscribe(listener);

      /**
       * initialize() тоже потенциально может
       * вызвать notify при первой записи initialValue.
       */
      listener.mockClear();

      store.setState(42);

      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
    });

    test('не уведомляет подписчика повторно, если serialized значение не изменилось', () => {
      const store = new PersistedStore(
        'settings',
        {
          page: 1,
        },
        new BrowserStorage('localStorage'),
      );

      const listener = jest.fn();

      const unsubscribe = store.subscribe(listener);

      listener.mockClear();

      store.setState({
        page: 1,
      });

      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });
  });

  describe('reset', () => {
    test('возвращает состояние к initialValue', () => {
      const store = new PersistedStore('counter', 5, new BrowserStorage('localStorage'));

      const unsubscribe = store.subscribe(jest.fn());

      store.setState(100);

      store.reset();

      expect(store.getSnapshot()).toBe(5);

      unsubscribe();
    });

    test('сохраняет initialValue обратно в storage', () => {
      const store = new PersistedStore('counter', 5, new BrowserStorage('localStorage'));

      const unsubscribe = store.subscribe(jest.fn());

      store.setState(100);

      store.reset();

      expect(window.localStorage.getItem('counter')).toBe('5');

      unsubscribe();
    });
  });

  describe('синхронизация через WindowEventBus', () => {
    test('синхронизирует независимые stores с одинаковым key и storageType', () => {
      const first = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const second = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const firstListener = jest.fn();

      const secondListener = jest.fn();

      const unsubscribeFirst = first.subscribe(firstListener);

      const unsubscribeSecond = second.subscribe(secondListener);

      firstListener.mockClear();
      secondListener.mockClear();

      first.setState(42);

      expect(first.getSnapshot()).toBe(42);

      expect(second.getSnapshot()).toBe(42);

      expect(firstListener).toHaveBeenCalledTimes(1);

      expect(secondListener).toHaveBeenCalledTimes(1);

      unsubscribeFirst();
      unsubscribeSecond();
    });

    test('синхронизирует functional updater между независимыми stores', () => {
      const first = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const second = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const unsubscribeFirst = first.subscribe(jest.fn());

      const unsubscribeSecond = second.subscribe(jest.fn());

      first.setState(10);

      second.setState((prev) => prev + 5);

      expect(first.getSnapshot()).toBe(15);

      expect(second.getSnapshot()).toBe(15);

      unsubscribeFirst();
      unsubscribeSecond();
    });

    test('не синхронизирует stores с разными ключами', () => {
      const first = new PersistedStore('first', 0, new BrowserStorage('localStorage'));

      const second = new PersistedStore('second', 0, new BrowserStorage('localStorage'));

      const secondListener = jest.fn();

      const unsubscribeFirst = first.subscribe(jest.fn());

      const unsubscribeSecond = second.subscribe(secondListener);

      secondListener.mockClear();

      first.setState(42);

      expect(second.getSnapshot()).toBe(0);

      expect(secondListener).not.toHaveBeenCalled();

      unsubscribeFirst();
      unsubscribeSecond();
    });

    test('не смешивает localStorage и sessionStorage с одинаковым key', () => {
      const localStore = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const sessionStore = new PersistedStore('counter', 0, new BrowserStorage('sessionStorage'));

      const sessionListener = jest.fn();

      const unsubscribeLocal = localStore.subscribe(jest.fn());

      const unsubscribeSession = sessionStore.subscribe(sessionListener);

      sessionListener.mockClear();

      localStore.setState(42);

      expect(localStore.getSnapshot()).toBe(42);

      expect(sessionStore.getSnapshot()).toBe(0);

      expect(sessionListener).not.toHaveBeenCalled();

      unsubscribeLocal();
      unsubscribeSession();
    });
  });

  describe('prefix', () => {
    test('сохраняет данные по ключу с префиксом', () => {
      const store = new PersistedStore(
        'counter',
        0,
        new BrowserStorage('localStorage', { prefix: 'custom' }),
      );

      const unsubscribe = store.subscribe(jest.fn());

      store.setState(42);

      expect(window.localStorage.getItem('custom_counter')).toBe('42');

      expect(window.localStorage.getItem('counter')).toBeNull();

      unsubscribe();
    });

    test('восстанавливает persisted значение из ключа с префиксом', () => {
      window.localStorage.setItem('custom_counter', '42');

      const store = new PersistedStore(
        'counter',
        0,
        new BrowserStorage('localStorage', { prefix: 'custom' }),
      );

      expect(store.getSnapshot()).toBe(42);
    });

    test('не читает значение без префикса', () => {
      window.localStorage.setItem('counter', '42');

      const store = new PersistedStore(
        'counter',
        0,
        new BrowserStorage('localStorage', { prefix: 'custom' }),
      );

      expect(store.getSnapshot()).toBe(0);
    });

    test('не синхронизирует stores с одинаковым key, но разными prefix', () => {
      const customStore = new PersistedStore(
        'counter',
        0,
        new BrowserStorage('localStorage', { prefix: 'custom' }),
      );

      const plainStore = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const plainListener = jest.fn();

      const unsubscribeCustom = customStore.subscribe(jest.fn());

      const unsubscribePlain = plainStore.subscribe(plainListener);

      plainListener.mockClear();

      customStore.setState(42);

      expect(customStore.getSnapshot()).toBe(42);

      expect(plainStore.getSnapshot()).toBe(0);

      expect(plainListener).not.toHaveBeenCalled();

      unsubscribeCustom();
      unsubscribePlain();
    });
  });

  describe('native localStorage events', () => {
    test('обновляет snapshot при изменении значения в другой вкладке', () => {
      const store = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const listener = jest.fn();

      const unsubscribe = store.subscribe(listener);

      listener.mockClear();

      window.localStorage.setItem('counter', '42');

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'counter',
          oldValue: '0',
          newValue: '42',
          storageArea: window.localStorage,
        }),
      );

      expect(store.getSnapshot()).toBe(42);

      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
    });

    test('возвращается к initialValue после удаления ключа в другой вкладке', () => {
      window.localStorage.setItem('counter', '42');

      const store = new PersistedStore('counter', 5, new BrowserStorage('localStorage'));

      const listener = jest.fn();

      const unsubscribe = store.subscribe(listener);

      listener.mockClear();

      window.localStorage.removeItem('counter');

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'counter',
          oldValue: '42',
          newValue: null,
          storageArea: window.localStorage,
        }),
      );

      expect(store.getSnapshot()).toBe(5);

      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
    });

    test('возвращается к initialValue после localStorage.clear в другой вкладке', () => {
      window.localStorage.setItem('counter', '42');

      const store = new PersistedStore('counter', 5, new BrowserStorage('localStorage'));

      const listener = jest.fn();

      const unsubscribe = store.subscribe(listener);

      listener.mockClear();

      window.localStorage.clear();

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: null,
          oldValue: null,
          newValue: null,
          storageArea: window.localStorage,
        }),
      );

      expect(store.getSnapshot()).toBe(5);

      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
    });

    test('не уведомляет подписчиков при событии с тем же raw значением', () => {
      const rawValue = JSON.stringify({
        page: 1,
      });

      window.localStorage.setItem('settings', rawValue);

      const store = new PersistedStore(
        'settings',
        {
          page: 0,
        },
        new BrowserStorage('localStorage'),
      );

      const listener = jest.fn();

      const unsubscribe = store.subscribe(listener);

      const firstSnapshot = store.getSnapshot();

      listener.mockClear();

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'settings',
          oldValue: rawValue,
          newValue: rawValue,
          storageArea: window.localStorage,
        }),
      );

      expect(listener).not.toHaveBeenCalled();

      expect(store.getSnapshot()).toBe(firstSnapshot);

      unsubscribe();
    });
  });

  describe('sessionStorage', () => {
    test('сохраняет данные в sessionStorage', () => {
      const store = new PersistedStore('counter', 0, new BrowserStorage('sessionStorage'));

      const unsubscribe = store.subscribe(jest.fn());

      store.setState(42);

      expect(window.sessionStorage.getItem('counter')).toBe('42');

      expect(window.localStorage.getItem('counter')).toBeNull();

      unsubscribe();
    });

    test('подписывается на native storage events для sessionStorage', () => {
      const subscribeSpy = jest.spyOn(BrowserStorage.prototype, 'subscribe');

      const store = new PersistedStore('counter', 0, new BrowserStorage('sessionStorage'));

      const unsubscribe = store.subscribe(jest.fn());

      expect(subscribeSpy).toHaveBeenCalled();

      unsubscribe();
    });
  });

  describe('ошибки Web Storage', () => {
    test('использует initialValue, если чтение storage завершилось ошибкой', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('Blocked', 'SecurityError');
      });

      const store = new PersistedStore('counter', 5, new BrowserStorage('localStorage'));

      expect(store.getSnapshot()).toBe(5);
    });

    test('продолжает работать in-memory, если запись в storage завершилась ошибкой', () => {
      const store = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const unsubscribe = store.subscribe(jest.fn());

      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      });

      store.setState(42);

      expect(store.getSnapshot()).toBe(42);

      unsubscribe();
    });

    test('синхронизирует in-memory состояние между stores при ошибке записи', () => {
      const first = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const second = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const unsubscribeFirst = first.subscribe(jest.fn());

      const unsubscribeSecond = second.subscribe(jest.fn());

      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      });

      first.setState(42);

      expect(first.getSnapshot()).toBe(42);

      expect(second.getSnapshot()).toBe(42);

      unsubscribeFirst();
      unsubscribeSecond();
    });
  });

  describe('lifecycle подписок', () => {
    test('подписывается на BrowserStorage только при появлении первого subscriber', () => {
      const subscribeSpy = jest.spyOn(BrowserStorage.prototype, 'subscribe');

      const store = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      expect(subscribeSpy).not.toHaveBeenCalled();

      const unsubscribe = store.subscribe(jest.fn());

      expect(subscribeSpy).toHaveBeenCalledTimes(1);

      unsubscribe();
    });

    test('не создаёт повторную BrowserStorage подписку для нескольких subscribers', () => {
      const subscribeSpy = jest.spyOn(BrowserStorage.prototype, 'subscribe');

      const store = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const unsubscribeFirst = store.subscribe(jest.fn());

      const unsubscribeSecond = store.subscribe(jest.fn());

      expect(subscribeSpy).toHaveBeenCalledTimes(1);

      unsubscribeFirst();
      unsubscribeSecond();
    });

    test('отписывается от BrowserStorage после удаления последнего subscriber', () => {
      const storageUnsubscribe = jest.fn();

      jest.spyOn(BrowserStorage.prototype, 'subscribe').mockReturnValue(storageUnsubscribe);

      const store = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const unsubscribeFirst = store.subscribe(jest.fn());

      const unsubscribeSecond = store.subscribe(jest.fn());

      unsubscribeFirst();

      expect(storageUnsubscribe).not.toHaveBeenCalled();

      unsubscribeSecond();

      expect(storageUnsubscribe).toHaveBeenCalledTimes(1);
    });

    test('не вызывает listener после unsubscribe', () => {
      const store = new PersistedStore('counter', 0, new BrowserStorage('localStorage'));

      const listener = jest.fn();

      const unsubscribe = store.subscribe(listener);

      listener.mockClear();

      unsubscribe();

      store.setState(42);

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
