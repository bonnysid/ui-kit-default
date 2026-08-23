/**
 * @jest-environment node
 */

import { EVENT_NAME_SEPARATOR } from '../constants';
import { WindowEventBus } from '../window-event-bus';

type TestEvents = {
  change: {
    value: number;
  };

  refresh: undefined;
};

describe('WindowEventBus в SSR окружении', () => {
  test('dispatch не выбрасывает исключение при отсутствии window', () => {
    const events = new WindowEventBus<TestEvents>();

    expect(() => {
      events.dispatch('change', {
        value: 42,
      });
    }).not.toThrow();
  });

  test('subscribe не выбрасывает исключение при отсутствии window', () => {
    const events = new WindowEventBus<TestEvents>();

    expect(() => {
      events.subscribe('change', jest.fn());
    }).not.toThrow();
  });

  test('subscribe возвращает unsubscribe-функцию при отсутствии window', () => {
    const events = new WindowEventBus<TestEvents>();

    const unsubscribe = events.subscribe('change', jest.fn());

    expect(unsubscribe).toEqual(expect.any(Function));
  });

  test('unsubscribe не выбрасывает исключение при отсутствии window', () => {
    const events = new WindowEventBus<TestEvents>();

    const unsubscribe = events.subscribe('change', jest.fn());

    expect(() => {
      unsubscribe();
    }).not.toThrow();
  });

  test('getEventName работает без browser окружения', () => {
    const events = new WindowEventBus<TestEvents>({
      prefix: 'app',
    });

    expect(events.getEventName('change')).toBe(`app${EVENT_NAME_SEPARATOR}change`);
  });
});
