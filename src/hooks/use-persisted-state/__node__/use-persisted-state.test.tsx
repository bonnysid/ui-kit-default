import { type PropsWithChildren, StrictMode } from 'react';

import { act, renderHook } from '@testing-library/react';

import { usePersistedState } from '../use-persisted-state';

import { getRenderedHook } from './helpers';

describe('usePersistedState', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();

    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  describe('базовое поведение', () => {
    test('возвращает initialValue', () => {
      const { result } = getRenderedHook();

      expect(result.current[0]).toBe(5);
    });

    test('восстанавливает persisted значение', () => {
      window.localStorage.setItem('counter', '42');

      const { result } = getRenderedHook();

      expect(result.current[0]).toBe(42);
    });

    test('setState обновляет React state', () => {
      const { result } = getRenderedHook('counter', 0);

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
    });

    test('поддерживает functional updater', () => {
      const { result } = getRenderedHook('counter', 10);

      act(() => {
        result.current[1]((prev) => prev + 5);
      });

      expect(result.current[0]).toBe(15);
    });

    test('reset возвращает initialValue', () => {
      const { result } = getRenderedHook();

      act(() => {
        result.current[1](100);
      });

      act(() => {
        result.current[2].reset();
      });

      expect(result.current[0]).toBe(5);
    });
  });

  describe('React synchronization', () => {
    test('синхронизирует два hook consumer с одинаковым key', () => {
      const first = getRenderedHook('counter', 0);

      const second = getRenderedHook('counter', 0);

      act(() => {
        first.result.current[1](42);
      });

      expect(first.result.current[0]).toBe(42);

      expect(second.result.current[0]).toBe(42);
    });

    test('не синхронизирует разные keys', () => {
      const first = getRenderedHook('first', 0);

      const second = getRenderedHook('second', 0);

      act(() => {
        first.result.current[1](42);
      });

      expect(first.result.current[0]).toBe(42);

      expect(second.result.current[0]).toBe(0);
    });

    test('не смешивает одинаковые keys из разных storage', () => {
      const local = getRenderedHook('counter', 0, 'localStorage');

      const session = getRenderedHook('counter', 0, 'sessionStorage');

      act(() => {
        local.result.current[1](42);
      });

      expect(local.result.current[0]).toBe(42);

      expect(session.result.current[0]).toBe(0);
    });

    test('синхронизирует sessionStorage consumers внутри текущего window', () => {
      const first = getRenderedHook('counter', 0, 'sessionStorage');

      const second = getRenderedHook('counter', 0, 'sessionStorage');

      act(() => {
        first.result.current[1](42);
      });

      expect(second.result.current[0]).toBe(42);
    });
  });

  describe('native localStorage synchronization', () => {
    test('обновляет React state при storage event из другой вкладки', () => {
      const { result } = getRenderedHook('counter', 0);

      act(() => {
        window.localStorage.setItem('counter', '42');

        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'counter',
            oldValue: '0',
            newValue: '42',
            storageArea: window.localStorage,
          })
        );
      });

      expect(result.current[0]).toBe(42);
    });

    test('возвращает initialValue после удаления значения в другой вкладке', () => {
      window.localStorage.setItem('counter', '42');

      const { result } = getRenderedHook();

      act(() => {
        window.localStorage.removeItem('counter');

        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'counter',
            oldValue: '42',
            newValue: null,
            storageArea: window.localStorage,
          })
        );
      });

      expect(result.current[0]).toBe(5);
    });
  });

  describe('смена аргументов', () => {
    test('переключает store при изменении key', () => {
      window.localStorage.setItem('first', '10');

      window.localStorage.setItem('second', '20');

      const { result, rerender } = renderHook(
        ({ storageKey }) => usePersistedState({ key: storageKey, initialValue: 0 }),
        {
          initialProps: {
            storageKey: 'first',
          },
        }
      );

      expect(result.current[0]).toBe(10);

      rerender({
        storageKey: 'second',
      });

      expect(result.current[0]).toBe(20);
    });

    test('переключает store при изменении storageType', () => {
      window.localStorage.setItem('counter', '10');

      window.sessionStorage.setItem('counter', '20');

      const { result, rerender } = renderHook(
        ({ storageType }: { storageType: 'localStorage' | 'sessionStorage' }) =>
          usePersistedState({ key: 'counter', initialValue: 0, storageType }),
        {
          initialProps: {
            storageType: 'localStorage',
          },
        }
      );

      expect(result.current[0]).toBe(10);

      rerender({
        storageType: 'sessionStorage',
      });

      expect(result.current[0]).toBe(20);
    });

    test('не пересоздаёт store при изменении initialValue', () => {
      const { result, rerender } = renderHook(
        ({ initialValue }) => usePersistedState({ key: 'counter', initialValue }),
        {
          initialProps: {
            initialValue: 5,
          },
        }
      );

      act(() => {
        result.current[1](42);
      });

      rerender({
        initialValue: 100,
      });

      expect(result.current[0]).toBe(42);

      act(() => {
        result.current[2].reset();
      });

      /**
       * initialValue фиксируется
       * в момент создания store.
       */
      expect(result.current[0]).toBe(5);
    });
  });

  describe('стабильность API', () => {
    test('сохраняет reference setState между rerenders', () => {
      const { result, rerender } = getRenderedHook('counter', 0);

      const setState = result.current[1];

      rerender();

      expect(result.current[1]).toBe(setState);
    });

    test('сохраняет reference actions между rerenders', () => {
      const { result, rerender } = getRenderedHook('counter', 0);

      const actions = result.current[2];

      rerender();

      expect(result.current[2]).toBe(actions);
    });

    test('сохраняет reference object state при обычном rerender', () => {
      window.localStorage.setItem(
        'settings',
        JSON.stringify({
          page: 1,
        })
      );

      const { result, rerender } = renderHook(() =>
        usePersistedState({
          key: 'settings',
          initialValue: {
            page: 0,
          },
        })
      );

      const state = result.current[0];

      rerender();

      expect(result.current[0]).toBe(state);
    });
  });

  describe('lifecycle', () => {
    test('перестаёт реагировать после unmount', () => {
      const first = getRenderedHook('counter', 0);

      const second = getRenderedHook('counter', 0);

      first.unmount();

      expect(() => {
        act(() => {
          second.result.current[1](42);
        });
      }).not.toThrow();

      expect(second.result.current[0]).toBe(42);
    });

    test('корректно работает в StrictMode', () => {
      const wrapper = ({ children }: PropsWithChildren) => <StrictMode>{children}</StrictMode>;

      const { result } = renderHook(() => usePersistedState({ key: 'counter', initialValue: 0 }), {
        wrapper,
      });

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);

      expect(window.localStorage.getItem('counter')).toBe('1');
    });
  });

  describe('fallback при ошибках storage', () => {
    test('React state продолжает работать, если запись в storage завершилась ошибкой', () => {
      const { result } = getRenderedHook('counter', 0);

      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      });

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
    });
  });
});
