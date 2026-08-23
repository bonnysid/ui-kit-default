import { EVENT_NAME_SEPARATOR } from '../constants';
import { WindowEventBus } from '../window-event-bus';

type TestEvents = {
  'counter:changed': {
    value: number;
  };

  'user:updated': {
    id: string;
    name?: string;
  };

  message: string;

  reset: null;

  refresh: void;
};

const TEST_PREFIX = 'prefix';

describe('WindowEventBus', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getEventName', () => {
    test('возвращает исходное событие, если prefix не задан', () => {
      const eventBus = new WindowEventBus<TestEvents>();

      expect(eventBus.getEventName('counter:changed')).toBe('counter:changed');
    });

    test('добавляет префикс к событию, если он задан', () => {
      const eventBus = new WindowEventBus<TestEvents>({ prefix: TEST_PREFIX });

      expect(eventBus.getEventName('counter:changed')).toBe(
        `${TEST_PREFIX}${EVENT_NAME_SEPARATOR}counter:changed`,
      );
    });

    test('считает пустой префикс как отсутствие префикса', () => {
      const eventBus = new WindowEventBus<TestEvents>({ prefix: '' });

      expect(eventBus.getEventName('counter:changed')).toBe(`counter:changed`);
    });
  });

  describe('dispatch / subscribe', () => {
    test('передает payload подписчику', () => {
      const eventBus = new WindowEventBus<TestEvents>();
      const listener = jest.fn();

      const unsubscribe = eventBus.subscribe('counter:changed', listener);

      eventBus.dispatch('counter:changed', { value: 10 });

      expect(listener).toHaveBeenCalledWith({ value: 10 });

      unsubscribe();
    });

    test('вызывает подписчика синхронно', () => {
      const eventBus = new WindowEventBus<TestEvents>();

      const calls: string[] = [];

      const unsubscribe = eventBus.subscribe('counter:changed', () => {
        calls.push('listener');
      });

      calls.push('before');

      eventBus.dispatch('counter:changed', { value: 10 });

      calls.push('after');

      unsubscribe();

      expect(calls).toEqual(['before', 'listener', 'after']);

      unsubscribe();
    });

    test('передает строковый payload подписчику', () => {
      const eventBus = new WindowEventBus<TestEvents>();
      const listener = jest.fn();

      const unsubscribe = eventBus.subscribe('message', listener);

      eventBus.dispatch('message', 'Hello, world!');

      expect(listener).toHaveBeenCalledWith('Hello, world!');

      unsubscribe();
    });

    test('передает null payload подписчику', () => {
      const eventBus = new WindowEventBus<TestEvents>();
      const listener = jest.fn();

      const unsubscribe = eventBus.subscribe('reset', listener);

      eventBus.dispatch('reset', null);

      expect(listener).toHaveBeenCalledWith(null);

      unsubscribe();
    });

    test('передает отправить событие без payload подписчику', () => {
      const eventBus = new WindowEventBus<TestEvents>();
      const listener = jest.fn();

      const unsubscribe = eventBus.subscribe('refresh', listener);

      eventBus.dispatch('refresh');

      expect(listener).toHaveBeenCalledWith(null);

      unsubscribe();
    });

    test('не вызывает подписчика другого события', () => {
      const eventBus = new WindowEventBus<TestEvents>();
      const listener = jest.fn();

      const unsubscribe = eventBus.subscribe('counter:changed', listener);

      eventBus.dispatch('message', 'Hello, world!');

      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });

    test('вызывает всех подписчиков одного события', () => {
      const eventBus = new WindowEventBus<TestEvents>();

      const listener1 = jest.fn();
      const listener2 = jest.fn();

      const unsubscribe1 = eventBus.subscribe('counter:changed', listener1);
      const unsubscribe2 = eventBus.subscribe('counter:changed', listener2);

      const payload = { value: 10 };

      eventBus.dispatch('counter:changed', payload);

      expect(listener1).toHaveBeenCalledWith(payload);
      expect(listener2).toHaveBeenCalledWith(payload);

      unsubscribe1();
      unsubscribe2();
    });

    test('вызывает подписчика при каждом dispatch', () => {
      const eventBus = new WindowEventBus<TestEvents>();
      const listener = jest.fn();

      const unsubscribe = eventBus.subscribe('counter:changed', listener);

      eventBus.dispatch('counter:changed', { value: 1 });
      eventBus.dispatch('counter:changed', { value: 2 });
      eventBus.dispatch('counter:changed', { value: 3 });

      expect(listener).toHaveBeenCalledTimes(3);

      expect(listener.mock.calls).toEqual([[{ value: 1 }], [{ value: 2 }], [{ value: 3 }]]);

      unsubscribe();
    });

    test('передает тот же reference payload без сериализации и копирования', () => {
      const eventBus = new WindowEventBus<TestEvents>();

      const listener = jest.fn();

      const payload = {
        value: 10,
      };

      const unsubscribe = eventBus.subscribe('counter:changed', listener);

      eventBus.dispatch('counter:changed', payload);

      expect(listener.mock.calls[0][0]).toBe(payload);

      unsubscribe();
    });
  });

  describe('unsubscribe', () => {
    test('перестает вызывать listener после unsubscribe', () => {
      const eventBus = new WindowEventBus<TestEvents>();

      const listener = jest.fn();

      const unsubscribe = eventBus.subscribe('counter:changed', listener);

      eventBus.dispatch('counter:changed', { value: 10 });

      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();

      eventBus.dispatch('counter:changed', { value: 20 });

      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('unsubscribe одного listener не влияет на другие', () => {
      const eventBus = new WindowEventBus<TestEvents>();

      const listener1 = jest.fn();
      const listener2 = jest.fn();

      const unsubscribe1 = eventBus.subscribe('counter:changed', listener1);
      const unsubscribe2 = eventBus.subscribe('counter:changed', listener2);

      unsubscribe1();

      eventBus.dispatch('counter:changed', { value: 10 });

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledWith({ value: 10 });

      unsubscribe2();
    });

    test('повторный unsubscribe не вызывает ошибку', () => {
      const eventBus = new WindowEventBus<TestEvents>();

      const listener = jest.fn();

      const unsubscribe = eventBus.subscribe('counter:changed', listener);

      expect(() => {
        unsubscribe();
        unsubscribe();
      }).not.toThrow();
    });
  });

  describe('prefix', () => {
    test('синхронизирует разные instances с одинаковым prefix', () => {
      const publisher = new WindowEventBus<TestEvents>({
        prefix: '@cm',
      });

      const subscriber = new WindowEventBus<TestEvents>({
        prefix: '@cm',
      });

      const listener = jest.fn();

      const unsubscribe = subscriber.subscribe('counter:changed', listener);

      publisher.dispatch('counter:changed', {
        value: 42,
      });

      expect(listener).toHaveBeenCalledWith({
        value: 42,
      });

      unsubscribe();
    });

    test('изолирует события с разными prefix', () => {
      const firstEvents = new WindowEventBus<TestEvents>({
        prefix: 'app-a',
      });

      const secondEvents = new WindowEventBus<TestEvents>({
        prefix: 'app-b',
      });

      const listener = jest.fn();

      const unsubscribe = secondEvents.subscribe('counter:changed', listener);

      firstEvents.dispatch('counter:changed', {
        value: 42,
      });

      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });

    test('событие с prefix не вызывает подписчика без prefix', () => {
      const prefixedEvents = new WindowEventBus<TestEvents>({
        prefix: '@cm',
      });

      const plainEvents = new WindowEventBus<TestEvents>();

      const listener = jest.fn();

      const unsubscribe = plainEvents.subscribe('counter:changed', listener);

      prefixedEvents.dispatch('counter:changed', {
        value: 42,
      });

      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });

    test('событие без prefix не вызывает подписчика с prefix', () => {
      const prefixedEvents = new WindowEventBus<TestEvents>({
        prefix: '@cm',
      });

      const plainEvents = new WindowEventBus<TestEvents>();

      const listener = jest.fn();

      const unsubscribe = prefixedEvents.subscribe('counter:changed', listener);

      plainEvents.dispatch('counter:changed', {
        value: 42,
      });

      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });
  });

  describe('работа между разными instances', () => {
    test('dispatch одного instance доставляет событие подписчику другого instance', () => {
      const publisher = new WindowEventBus<TestEvents>();

      const subscriber = new WindowEventBus<TestEvents>();

      const listener = jest.fn();

      const unsubscribe = subscriber.subscribe('user:updated', listener);

      publisher.dispatch('user:updated', {
        id: '42',
        name: 'John',
      });

      expect(listener).toHaveBeenCalledWith({
        id: '42',
        name: 'John',
      });

      unsubscribe();
    });

    test('не требует общего singleton instance для синхронизации', () => {
      const bundleAEvents = new WindowEventBus<TestEvents>({
        prefix: '@cm',
      });

      const bundleBEvents = new WindowEventBus<TestEvents>({
        prefix: '@cm',
      });

      const listener = jest.fn();

      const unsubscribe = bundleBEvents.subscribe('counter:changed', listener);

      bundleAEvents.dispatch('counter:changed', {
        value: 42,
      });

      expect(listener).toHaveBeenCalledWith({
        value: 42,
      });

      unsubscribe();
    });
  });

  describe('интеграция с нативными browser events', () => {
    test('публикует событие через window.dispatchEvent', () => {
      const events = new WindowEventBus<TestEvents>({
        prefix: 'app',
      });

      const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

      const payload = {
        value: 42,
      };

      events.dispatch('counter:changed', payload);

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);

      const event = dispatchEventSpy.mock.calls[0]?.[0];

      expect(event).toBeInstanceOf(CustomEvent);

      expect(event?.type).toBe(`app${EVENT_NAME_SEPARATOR}counter:changed`);

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- test
      expect((event as CustomEvent)?.detail).toBe(payload);
    });

    test('подписывается через window.addEventListener', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      const events = new WindowEventBus<TestEvents>({
        prefix: 'app',
      });

      const unsubscribe = events.subscribe('counter:changed', jest.fn());

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        `app${EVENT_NAME_SEPARATOR}counter:changed`,
        expect.any(Function),
      );

      unsubscribe();
    });

    test('удаляет подписку через window.removeEventListener', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const events = new WindowEventBus<TestEvents>({
        prefix: 'app',
      });

      const unsubscribe = events.subscribe('counter:changed', jest.fn());

      unsubscribe();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        `app${EVENT_NAME_SEPARATOR}counter:changed`,
        expect.any(Function),
      );
    });

    test('получает CustomEvent, отправленный напрямую через window', () => {
      const events = new WindowEventBus<TestEvents>({
        prefix: 'app',
      });

      const listener = jest.fn();

      const unsubscribe = events.subscribe('counter:changed', listener);

      window.dispatchEvent(
        new CustomEvent(`app${EVENT_NAME_SEPARATOR}counter:changed`, {
          detail: {
            value: 42,
          },
        }),
      );

      expect(listener).toHaveBeenCalledTimes(1);

      expect(listener).toHaveBeenCalledWith({
        value: 42,
      });

      unsubscribe();
    });

    test('игнорирует обычный Event без detail', () => {
      const events = new WindowEventBus<TestEvents>({
        prefix: 'app',
      });

      const listener = jest.fn();

      const unsubscribe = events.subscribe('counter:changed', listener);

      window.dispatchEvent(new Event(`app${EVENT_NAME_SEPARATOR}counter:changed`));

      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });
  });
});
