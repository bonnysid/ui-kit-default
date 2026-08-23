import { BrowserStorage } from '../browser-storage';
import { KEY_SEPARATOR } from '../constants';

const TEST_KEY = 'key';
const TEST_MISSING_KEY = 'missing';
const TEST_NUM_VALUE = 52;
const TEST_ARR_VALUE = [1, 2, 3];
const TEST_ARR_RAW_VALUE = JSON.stringify(TEST_ARR_VALUE);
const TEST_PREFIX = 'prefix';
const TEST_OBJ_VALUE = { theme: 'dark' };
const TEST_OBJ_RAW_VALUE = JSON.stringify(TEST_OBJ_VALUE);

const TEST_WRONG_VALUE = 'wrong';
const TEST_CORRECT_VALUE = 'correct';

describe('browser-storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();

    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  describe.each(['localStorage', 'sessionStorage'] as const)(
    'проверка с типом хранилища %s',
    (storageType) => {
      describe('getKey', () => {
        test('возвращает изначальный ключ, если не задан prefix', () => {
          const storage = new BrowserStorage(storageType);

          expect(storage.getKey(TEST_KEY)).toBe(TEST_KEY);
        });

        test('добавляет префикс к изначальному ключ, если задан prefix', () => {
          const storage = new BrowserStorage(storageType, { prefix: TEST_PREFIX });

          expect(storage.getKey(TEST_KEY)).toBe(`${TEST_PREFIX}${KEY_SEPARATOR}${TEST_KEY}`);
        });

        test('считает пустой prefix отсутствующим', () => {
          const storage = new BrowserStorage(storageType, { prefix: '' });

          expect(storage.getKey(TEST_KEY)).toBe(TEST_KEY);
        });

        test('поддерживает пустой ключ при наличие prefix', () => {
          const storage = new BrowserStorage(storageType, { prefix: TEST_PREFIX });

          expect(storage.getKey('')).toBe(`${TEST_PREFIX}${KEY_SEPARATOR}`);
        });
      });

      describe('storageType', () => {
        test('возвращает тип хранилища', () => {
          const storage = new BrowserStorage(storageType);

          expect(storage.storageType).toBe(storageType);
        });
      });

      describe('writeRaw', () => {
        test('сохраняет сырое значение', () => {
          const storage = new BrowserStorage(storageType);

          const result = storage.writeRaw(TEST_KEY, TEST_OBJ_RAW_VALUE);

          expect(result).toEqual({
            ok: true,
            data: undefined,
          });

          expect(window[storageType].getItem(TEST_KEY)).toBe(TEST_OBJ_RAW_VALUE);
        });

        test('сохраняет сырое значение с prefix', () => {
          const storage = new BrowserStorage(storageType, { prefix: TEST_PREFIX });

          const result = storage.writeRaw(TEST_KEY, TEST_OBJ_RAW_VALUE);

          expect(result).toEqual({
            ok: true,
            data: undefined,
          });

          expect(window[storageType].getItem(`${TEST_PREFIX}${KEY_SEPARATOR}${TEST_KEY}`)).toBe(
            TEST_OBJ_RAW_VALUE
          );

          expect(window[storageType].getItem(TEST_KEY)).toBeNull();
        });
      });

      describe('readRaw', () => {
        test('возвращает существующее сырое значение', () => {
          window[storageType].setItem(TEST_KEY, TEST_OBJ_RAW_VALUE);

          const storage = new BrowserStorage(storageType);

          const result = storage.readRaw(TEST_KEY);

          expect(result).toEqual({
            ok: true,
            data: TEST_OBJ_RAW_VALUE,
          });
        });

        test('возвращает null, если ключ отсутствует', () => {
          const storage = new BrowserStorage(storageType);

          const result = storage.readRaw(TEST_MISSING_KEY);

          expect(result).toEqual({
            ok: true,
            data: null,
          });
        });

        test('возвращает существующее сырое значение с prefix', () => {
          window[storageType].setItem(TEST_KEY, TEST_WRONG_VALUE);
          window[storageType].setItem(
            `${TEST_PREFIX}${KEY_SEPARATOR}${TEST_KEY}`,
            TEST_CORRECT_VALUE
          );

          const storage = new BrowserStorage(storageType, { prefix: TEST_PREFIX });

          const result = storage.readRaw(TEST_KEY);

          expect(result).toEqual({
            ok: true,
            data: TEST_CORRECT_VALUE,
          });
        });
      });

      describe('set / get', () => {
        test('сохраняет и возвращает строку', () => {
          const storage = new BrowserStorage(storageType);

          storage.set(TEST_KEY, TEST_CORRECT_VALUE);

          expect(storage.get(TEST_KEY)).toEqual({
            ok: true,
            data: {
              value: TEST_CORRECT_VALUE,
              rawValue: JSON.stringify(TEST_CORRECT_VALUE),
            },
          });

          storage.set(TEST_KEY, TEST_OBJ_VALUE);

          expect(storage.get(TEST_KEY)).toEqual({
            ok: true,
            data: {
              value: TEST_OBJ_VALUE,
              rawValue: TEST_OBJ_RAW_VALUE,
            },
          });
        });

        test('сохраняет и возвращает объект', () => {
          const storage = new BrowserStorage(storageType);

          storage.set(TEST_KEY, TEST_OBJ_VALUE);

          expect(storage.get(TEST_KEY)).toEqual({
            ok: true,
            data: {
              value: TEST_OBJ_VALUE,
              rawValue: TEST_OBJ_RAW_VALUE,
            },
          });
        });

        test('сохраняет и возвращает число', () => {
          const storage = new BrowserStorage(storageType);

          storage.set(TEST_KEY, TEST_NUM_VALUE);

          expect(storage.get(TEST_KEY)).toEqual({
            ok: true,
            data: {
              value: TEST_NUM_VALUE,
              rawValue: JSON.stringify(TEST_NUM_VALUE),
            },
          });
        });

        test('сохраняет и возвращает false', () => {
          const storage = new BrowserStorage(storageType);

          storage.set(TEST_KEY, false);

          expect(storage.get(TEST_KEY)).toEqual({
            ok: true,
            data: {
              value: false,
              rawValue: JSON.stringify(false),
            },
          });
        });

        test('сохраняет и возвращает 0', () => {
          const storage = new BrowserStorage(storageType);

          storage.set(TEST_KEY, 0);

          expect(storage.get(TEST_KEY)).toEqual({
            ok: true,
            data: {
              value: 0,
              rawValue: JSON.stringify(0),
            },
          });
        });

        test('сохраняет и возвращает пустую строку', () => {
          const storage = new BrowserStorage(storageType);

          storage.set(TEST_KEY, '');

          expect(storage.get(TEST_KEY)).toEqual({
            ok: true,
            data: {
              value: '',
              rawValue: JSON.stringify(''),
            },
          });
        });

        test('сохраняет и возвращает null', () => {
          const storage = new BrowserStorage(storageType);

          storage.set(TEST_KEY, null);

          expect(storage.get(TEST_KEY)).toEqual({
            ok: true,
            data: {
              value: null,
              rawValue: JSON.stringify(null),
            },
          });
        });

        test('отличает отсутствующие значение от сохраненного null', () => {
          const storage = new BrowserStorage(storageType);

          expect(storage.get(TEST_MISSING_KEY)).toEqual({
            ok: true,
            data: {
              value: null,
              rawValue: null,
            },
          });

          storage.set(TEST_KEY, null);

          expect(storage.get(TEST_KEY)).toEqual({
            ok: true,
            data: {
              value: null,
              rawValue: JSON.stringify(null),
            },
          });
        });

        test('сохраняет и возвращает массив', () => {
          const storage = new BrowserStorage(storageType);

          storage.set(TEST_KEY, TEST_ARR_VALUE);

          expect(storage.get(TEST_KEY)).toEqual({
            ok: true,
            data: {
              value: TEST_ARR_VALUE,
              rawValue: TEST_ARR_RAW_VALUE,
            },
          });
        });

        test('возвращает ошибку, если в хранилище некорректный JSON', () => {
          window[storageType].setItem(TEST_KEY, '{invalid');

          const storage = new BrowserStorage(storageType);

          const result = storage.get(TEST_KEY);

          expect(result.ok).toBe(false);

          // @ts-ignore
          expect(result.error).toBeInstanceOf(SyntaxError);
        });

        test('не изменяет значение в хранилище при ошибке десериализации', () => {
          window[storageType].setItem(TEST_KEY, '{invalid');

          const storage = new BrowserStorage(storageType);

          storage.get(TEST_KEY);

          expect(window[storageType].getItem(TEST_KEY)).toBe('{invalid');
        });

        test('возвращает ошибку, если значение невозможно сериализовать', () => {
          const storage = new BrowserStorage(storageType);

          const circular: { self?: unknown } = {};

          // eslint-disable-next-line no-restricted-syntax -- test
          circular.self = circular;

          const result = storage.set(TEST_KEY, circular);

          expect(result.ok).toBe(false);

          expect(window[storageType].getItem(TEST_KEY)).toBeNull();
        });

        test('возвращает ошибку, при попытке сохранить undefined', () => {
          const storage = new BrowserStorage(storageType);

          const result = storage.set(TEST_KEY, undefined);

          expect(result.ok).toBe(false);

          expect(window[storageType].getItem(TEST_KEY)).toBeNull();
        });

        test('возвращает ошибку, при попытке сохранить BigInt', () => {
          const storage = new BrowserStorage(storageType);

          const result = storage.set(TEST_KEY, BigInt(10));

          expect(result.ok).toBe(false);

          expect(window[storageType].getItem(TEST_KEY)).toBeNull();
        });
      });

      describe('getValue', () => {
        test('возвращает десериализованное значение', () => {
          const storage = new BrowserStorage(storageType);

          storage.set(TEST_KEY, TEST_NUM_VALUE);

          expect(storage.getValue(TEST_KEY)).toBe(TEST_NUM_VALUE);
        });

        test('возвращает undefined, если ключ отсутствует', () => {
          const storage = new BrowserStorage(storageType);

          expect(storage.getValue(TEST_MISSING_KEY)).toBeUndefined();
        });

        test('возвращает undefined, если значение не корректно', () => {
          window[storageType].setItem(TEST_KEY, '{invalid');

          const storage = new BrowserStorage(storageType);

          expect(storage.getValue(TEST_KEY)).toBeUndefined();
        });

        test('возвращает сохраненный null', () => {
          const storage = new BrowserStorage(storageType);

          storage.set(TEST_KEY, null);

          expect(storage.getValue(TEST_KEY)).toBeNull();
        });
      });

      describe('has', () => {
        test('возвращает true, если ключ существует', () => {
          const storage = new BrowserStorage(storageType);

          storage.set(TEST_KEY, null);

          expect(storage.has(TEST_KEY)).toBe(true);
        });

        test('возвращает false, если ключ НЕ существует', () => {
          const storage = new BrowserStorage(storageType);

          expect(storage.has(TEST_KEY)).toBe(false);
        });

        test('учитывает префикс при проверке ключа', () => {
          window[storageType].setItem(TEST_KEY, TEST_ARR_RAW_VALUE);

          const storage = new BrowserStorage(storageType, { prefix: TEST_PREFIX });

          expect(storage.has(TEST_KEY)).toBe(false);

          window[storageType].setItem(
            `${TEST_PREFIX}${KEY_SEPARATOR}${TEST_KEY}`,
            TEST_ARR_RAW_VALUE
          );

          expect(storage.has(TEST_KEY)).toBe(true);
        });
      });

      describe('remove', () => {
        test('удаляет значение из хранилища', () => {
          window[storageType].setItem(TEST_KEY, TEST_ARR_RAW_VALUE);

          const storage = new BrowserStorage(storageType);

          expect(storage.remove(TEST_KEY)).toEqual({
            ok: true,
            data: undefined,
          });

          expect(window[storageType].getItem(TEST_KEY)).toBeNull();
        });

        test('удаляет значение только с соответствующим prefix', () => {
          window[storageType].setItem(TEST_KEY, TEST_ARR_RAW_VALUE);
          window[storageType].setItem(
            `${TEST_PREFIX}${KEY_SEPARATOR}${TEST_KEY}`,
            TEST_ARR_RAW_VALUE
          );

          const storage = new BrowserStorage(storageType, { prefix: TEST_PREFIX });

          expect(storage.remove(TEST_KEY)).toEqual({
            ok: true,
            data: undefined,
          });

          expect(
            window[storageType].getItem(`${TEST_PREFIX}${KEY_SEPARATOR}${TEST_KEY}`)
          ).toBeNull();

          expect(window[storageType].getItem(TEST_KEY)).toBe(TEST_ARR_RAW_VALUE);
        });

        test('успешно завершается если удаляемый ключ отсутствует', () => {
          const storage = new BrowserStorage(storageType);

          expect(storage.remove(TEST_MISSING_KEY)).toEqual({
            ok: true,
            data: undefined,
          });
        });
      });

      describe('clear', () => {
        test('полностью очищает хранилище если prefix не задан', () => {
          window[storageType].setItem('a', '1');
          window[storageType].setItem('b', '2');

          const storage = new BrowserStorage(storageType);

          expect(storage.clear()).toEqual({
            ok: true,
            data: undefined,
          });

          expect(window[storageType]).toHaveLength(0);
        });

        test('очищает только заданные ключи', () => {
          window[storageType].setItem('a', '1');
          window[storageType].setItem('b', '2');
          window[storageType].setItem('v', '3');

          const storage = new BrowserStorage(storageType);

          expect(storage.clear(['a', 'b'])).toEqual({
            ok: true,
            data: undefined,
          });

          expect(window[storageType]).toHaveLength(1);
          expect(window[storageType].getItem('v')).toBe('3');
        });

        test('очищает только заданные ключи c prefix', () => {
          window[storageType].setItem(`${TEST_PREFIX}${KEY_SEPARATOR}a`, '1');
          window[storageType].setItem(`a`, '1');
          window[storageType].setItem('b', '2');
          window[storageType].setItem('v', '3');

          const storage = new BrowserStorage(storageType, { prefix: TEST_PREFIX });

          expect(storage.clear(['a', 'b'])).toEqual({
            ok: true,
            data: undefined,
          });

          expect(window[storageType]).toHaveLength(3);
          expect(window[storageType].getItem('a')).toBe('1');
          expect(window[storageType].getItem('b')).toBe('2');
          expect(window[storageType].getItem('v')).toBe('3');
        });

        test('удаляет ключи только с указанным prefix', () => {
          window[storageType].setItem('a', '1');
          window[storageType].setItem(`${TEST_PREFIX}${KEY_SEPARATOR}a`, '1');
          window[storageType].setItem(`other${KEY_SEPARATOR}b`, '2');

          const storage = new BrowserStorage(storageType, { prefix: TEST_PREFIX });

          expect(storage.clear()).toEqual({
            ok: true,
            data: undefined,
          });

          expect(window[storageType]).toHaveLength(2);

          expect(window[storageType].getItem('a')).toBe('1');
          expect(window[storageType].getItem(`other${KEY_SEPARATOR}b`)).toBe('2');
        });

        test('удаляет ключи с похожими prefix', () => {
          window[storageType].setItem('a', '1');
          window[storageType].setItem(`${TEST_PREFIX}${KEY_SEPARATOR}a`, '1');
          window[storageType].setItem(`${TEST_PREFIX}2${KEY_SEPARATOR}b`, '2');

          const storage = new BrowserStorage(storageType, { prefix: TEST_PREFIX });

          expect(storage.clear()).toEqual({
            ok: true,
            data: undefined,
          });

          expect(window[storageType]).toHaveLength(2);

          expect(window[storageType].getItem('a')).toBe('1');
          expect(window[storageType].getItem(`${TEST_PREFIX}2${KEY_SEPARATOR}b`)).toBe('2');
        });
      });
    }
  );

  describe('изоляция хранилищ', () => {
    test('localStorage и sessionStorage хранят значения независимо друг от друга', () => {
      const local = new BrowserStorage('localStorage');
      const session = new BrowserStorage('sessionStorage');

      local.set(TEST_KEY, '1');
      session.set(TEST_KEY, '2');

      expect(local.getValue(TEST_KEY)).toBe('1');
      expect(session.getValue(TEST_KEY)).toBe('2');

      expect(window.localStorage.getItem(TEST_KEY)).toBe(JSON.stringify('1'));
      expect(window.sessionStorage.getItem(TEST_KEY)).toBe(JSON.stringify('2'));
    });
  });

  describe('ошибки браузерного хранилища', () => {
    test('возвращает ошибку, если getItem выбрасывает исключение', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('Blocked', 'SecurityError');
      });

      const storage = new BrowserStorage('localStorage');

      const res = storage.get(TEST_KEY);

      expect(res.ok).toBe(false);

      // @ts-ignore
      expect(res.error).toBeInstanceOf(DOMException);
    });

    test('возвращает ошибку, если setItem выбрасывает исключение', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Quota exceeded', 'QuataExceededError');
      });

      const storage = new BrowserStorage('localStorage');

      const res = storage.set(TEST_KEY, TEST_ARR_VALUE);

      expect(res.ok).toBe(false);

      // @ts-ignore
      expect(res.error).toBeInstanceOf(DOMException);
    });

    test('возвращает ошибку, если removeItem выбрасывает исключение', () => {
      jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new DOMException('Blocked', 'SecurityError');
      });

      const storage = new BrowserStorage('localStorage');

      const res = storage.remove(TEST_KEY);

      expect(res.ok).toBe(false);

      // @ts-ignore
      expect(res.error).toBeInstanceOf(DOMException);
    });

    test('возвращает ошибку, если clear выбрасывает исключение', () => {
      jest.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
        throw new DOMException('Blocked', 'SecurityError');
      });

      const storage = new BrowserStorage('localStorage');

      const res = storage.clear();

      expect(res.ok).toBe(false);

      // @ts-ignore
      expect(res.error).toBeInstanceOf(DOMException);
    });
  });

  describe('subscribe', () => {
    test('вызывает listener при изменении соответствующего ключа', () => {
      const storage = new BrowserStorage('localStorage');

      const listener = jest.fn();

      const unsubscribe = storage.subscribe('counter', listener);

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'counter',
          oldValue: '1',
          newValue: '2',
          storageArea: window.localStorage,
        })
      );

      expect(listener).toHaveBeenCalledTimes(1);

      expect(listener).toHaveBeenCalledWith({
        key: 'counter',
        oldValue: '1',
        newValue: '2',
      });

      unsubscribe();
    });

    test('не вызывает listener при изменении другого ключа', () => {
      const storage = new BrowserStorage('localStorage');

      const listener = jest.fn();

      const unsubscribe = storage.subscribe('counter', listener);

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'other',
          oldValue: '1',
          newValue: '2',
          storageArea: window.localStorage,
        })
      );

      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });

    test('учитывает prefix при подписке на ключ', () => {
      const storage = new BrowserStorage('localStorage', {
        prefix: TEST_PREFIX,
      });

      const listener = jest.fn();

      const unsubscribe = storage.subscribe('counter', listener);

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: `${TEST_PREFIX}${KEY_SEPARATOR}counter`,
          oldValue: '1',
          newValue: '2',
          storageArea: window.localStorage,
        })
      );

      expect(listener).toHaveBeenCalledTimes(1);

      expect(listener).toHaveBeenCalledWith({
        key: `${TEST_PREFIX}${KEY_SEPARATOR}counter`,
        oldValue: '1',
        newValue: '2',
      });

      unsubscribe();
    });

    test('не реагирует на ключ без prefix, если BrowserStorage создан с prefix', () => {
      const storage = new BrowserStorage('localStorage', {
        prefix: 'app',
      });

      const listener = jest.fn();

      const unsubscribe = storage.subscribe('counter', listener);

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'counter',
          newValue: '2',
          storageArea: window.localStorage,
        })
      );

      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });

    test('не реагирует на событие другого типа хранилища', () => {
      const storage = new BrowserStorage('localStorage');

      const listener = jest.fn();

      const unsubscribe = storage.subscribe('counter', listener);

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'counter',
          newValue: '2',
          storageArea: window.sessionStorage,
        })
      );

      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });

    test('поддерживает подписку на sessionStorage', () => {
      const storage = new BrowserStorage('sessionStorage');

      const listener = jest.fn();

      const unsubscribe = storage.subscribe('counter', listener);

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'counter',
          oldValue: '1',
          newValue: '2',
          storageArea: window.sessionStorage,
        })
      );

      expect(listener).toHaveBeenCalledWith({
        key: 'counter',
        oldValue: '1',
        newValue: '2',
      });

      unsubscribe();
    });

    test('обрабатывает удаление ключа', () => {
      const storage = new BrowserStorage('localStorage');

      const listener = jest.fn();

      const unsubscribe = storage.subscribe('counter', listener);

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'counter',
          oldValue: '42',
          newValue: null,
          storageArea: window.localStorage,
        })
      );

      expect(listener).toHaveBeenCalledWith({
        key: 'counter',
        oldValue: '42',
        newValue: null,
      });

      unsubscribe();
    });

    test('обрабатывает очистку всего хранилища', () => {
      const storage = new BrowserStorage('localStorage', {
        prefix: TEST_PREFIX,
      });

      const listener = jest.fn();

      const unsubscribe = storage.subscribe('counter', listener);

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: null,
          oldValue: null,
          newValue: null,
          storageArea: window.localStorage,
        })
      );

      expect(listener).toHaveBeenCalledWith({
        key: `${TEST_PREFIX}${KEY_SEPARATOR}counter`,
        oldValue: null,
        newValue: null,
      });

      unsubscribe();
    });

    test('вызывает несколько подписчиков одного ключа независимо друг от друга', () => {
      const storage = new BrowserStorage('localStorage');

      const firstListener = jest.fn();

      const secondListener = jest.fn();

      const unsubscribeFirst = storage.subscribe('counter', firstListener);

      const unsubscribeSecond = storage.subscribe('counter', secondListener);

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'counter',
          newValue: '42',
          storageArea: window.localStorage,
        })
      );

      expect(firstListener).toHaveBeenCalledTimes(1);

      expect(secondListener).toHaveBeenCalledTimes(1);

      unsubscribeFirst();
      unsubscribeSecond();
    });

    test('перестаёт вызывать listener после unsubscribe', () => {
      const storage = new BrowserStorage('localStorage');

      const listener = jest.fn();

      const unsubscribe = storage.subscribe('counter', listener);

      unsubscribe();

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'counter',
          newValue: '42',
          storageArea: window.localStorage,
        })
      );

      expect(listener).not.toHaveBeenCalled();
    });

    test('повторный unsubscribe не приводит к ошибке', () => {
      const storage = new BrowserStorage('localStorage');

      const unsubscribe = storage.subscribe('counter', jest.fn());

      expect(() => {
        unsubscribe();
        unsubscribe();
      }).not.toThrow();
    });

    test('передаёт raw значения без десериализации', () => {
      const storage = new BrowserStorage('localStorage');

      const listener = jest.fn();

      const unsubscribe = storage.subscribe('settings', listener);

      const rawValue = '{"theme":"dark"}';

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'settings',
          oldValue: null,
          newValue: rawValue,
          storageArea: window.localStorage,
        })
      );

      expect(listener).toHaveBeenCalledWith({
        key: 'settings',
        oldValue: null,
        newValue: rawValue,
      });

      unsubscribe();
    });
  });
});
