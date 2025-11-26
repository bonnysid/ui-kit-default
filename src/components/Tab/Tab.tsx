import { ReactElement, useId } from 'react';

import { bindStyles } from '@/utils';
import { IconTypes } from '../Icon';
import { Loader } from '../Loader';
import styles from './Tab.module.scss';
import { TabIcon } from './TabIcon';
import { TabListProps } from './TabList';

export enum TabSize {
  LARGE = 'large',
}

export type TabType<T> = {
  value: T;
  label: string;
  count?: number;
  disabled?: boolean;
  onClick?: () => void;
  prefix?: ReactElement | IconTypes;
  suffix?: ReactElement | IconTypes;
  isLoading?: boolean;
  isActive?: boolean;
};

type Props<T> = TabType<T> & Partial<TabListProps<T>>;

const cx = bindStyles(styles);

export const Tab = <T,>({
  value,
  label,
  size,
  count,
  disabled,
  isActive,
  isLoading,
  onClick,
  prefix,
  suffix,
}: Props<T>) => {
  const idPrefix = useId();

  return (
    <button
      type="button"
      className={cx('body', size, { isActive, disabled })}
      onClick={onClick}
      id={`${idPrefix}-${value}`}
    >
      {prefix && <TabIcon isActive={isActive} icon={prefix} />}
      {label && <div className={cx('label')}>{label}</div>}
      {suffix && <TabIcon isActive={isActive} icon={suffix} />}
      {(isLoading || count) &&
        (isLoading ? (
          <div className={cx('loader')}>
            <Loader type="spinner-progress" />
          </div>
        ) : (
          <div className={cx('count')}>{count}</div>
        ))}
    </button>
  );
};
