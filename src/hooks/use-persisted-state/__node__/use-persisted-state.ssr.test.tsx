/**
 * @jest-environment node
 */

import { renderToString } from 'react-dom/server';

import { usePersistedState } from '../use-persisted-state';

describe('usePersistedState в SSR окружении', () => {
  test('рендерит initialValue на сервере', () => {
    const Component = () => {
      const [value] = usePersistedState({ key: 'counter', initialValue: 42 });

      return <span>{value}</span>;
    };

    expect(renderToString(<Component />)).toContain('42');
  });

  test('не падает при использовании localStorage на сервере', () => {
    const Component = () => {
      usePersistedState({ key: 'counter', initialValue: 0, storageType: 'localStorage' });

      return null;
    };

    expect(() => {
      renderToString(<Component />);
    }).not.toThrow();
  });

  test('не падает при использовании sessionStorage на сервере', () => {
    const Component = () => {
      usePersistedState({ key: 'counter', initialValue: 0, storageType: 'sessionStorage' });

      return null;
    };

    expect(() => {
      renderToString(<Component />);
    }).not.toThrow();
  });

  test('рендерит initial object без обращения к browser storage', () => {
    const Component = () => {
      const [value] = usePersistedState({
        key: 'settings',
        initialValue: {
          page: 10,
        },
      });

      return <span>{value.page}</span>;
    };

    expect(renderToString(<Component />)).toContain('10');
  });

  test('использует initialValue для каждого независимого server render', () => {
    const Component = ({ initialValue }: { initialValue: number }) => {
      const [value] = usePersistedState({ key: 'counter', initialValue });

      return <span>{value}</span>;
    };

    const first = renderToString(<Component initialValue={10} />);

    const second = renderToString(<Component initialValue={20} />);

    expect(first).toContain('10');

    expect(second).toContain('20');
  });
});
