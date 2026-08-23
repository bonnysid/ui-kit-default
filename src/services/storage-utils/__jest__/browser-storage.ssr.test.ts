/**
 * @jest-environment node
 */

import { BrowserStorage } from '../browser-storage';

const TEST_KEY = 'key';
const TEST_KEY_RAW_VALUE = 'value';

describe('browser-storage в серверном окружение', () => {
  test('readRaw не выбрасывает исключение при отсутствие window', () => {
    const storage = new BrowserStorage('localStorage');

    const result = storage.readRaw(TEST_KEY);

    expect(result.ok).toBe(false);
  });

  test('writeRaw не выбрасывает исключение при отсутствие window', () => {
    const storage = new BrowserStorage('localStorage');

    const result = storage.writeRaw(TEST_KEY, TEST_KEY_RAW_VALUE);

    expect(result.ok).toBe(false);
  });

  test('set не выбрасывает исключение при отсутствие window', () => {
    const storage = new BrowserStorage('localStorage');

    const result = storage.set(TEST_KEY, TEST_KEY_RAW_VALUE);

    expect(result.ok).toBe(false);
  });

  test('get не выбрасывает исключение при отсутствие window', () => {
    const storage = new BrowserStorage('localStorage');

    const result = storage.get(TEST_KEY);

    expect(result.ok).toBe(false);
  });

  test('remove не выбрасывает исключение при отсутствие window', () => {
    const storage = new BrowserStorage('localStorage');

    const result = storage.remove(TEST_KEY);

    expect(result.ok).toBe(false);
  });

  test('clear не выбрасывает исключение при отсутствие window', () => {
    const storage = new BrowserStorage('localStorage');

    const result = storage.clear();

    expect(result.ok).toBe(false);
  });

  test('has не выбрасывает исключение при отсутствие window', () => {
    const storage = new BrowserStorage('localStorage');

    const result = storage.has(TEST_KEY);

    expect(result).toBe(false);
  });

  test('getValue не выбрасывает исключение при отсутствие window и возвращает undefined', () => {
    const storage = new BrowserStorage('localStorage');

    const result = storage.getValue(TEST_KEY);

    expect(result).toBeUndefined();
  });

  test('subscribe не выбрасывает исключение при отсутствии window', () => {
    const storage = new BrowserStorage('localStorage');

    expect(() => {
      storage.subscribe('counter', jest.fn());
    }).not.toThrow();
  });

  test('subscribe возвращает безопасную unsubscribe-функцию при отсутствии window', () => {
    const storage = new BrowserStorage('localStorage');

    const unsubscribe = storage.subscribe('counter', jest.fn());

    expect(unsubscribe).toEqual(expect.any(Function));

    expect(() => {
      unsubscribe();
    }).not.toThrow();
  });
});
