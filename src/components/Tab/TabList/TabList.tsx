import { bindStyles } from '@/utils';
import { Tab, TabSize, TabType } from '../Tab';
import styles from './TabList.module.scss';

const cx = bindStyles(styles);

export type TabListProps<T> = {
  tabs: TabType<T>[];
  value: T;
  onChange: (value: T, tab: TabType<T>) => void;
  size?: TabSize;
};

export const TabList = <T,>({ tabs, size = TabSize.LARGE, value, onChange }: TabListProps<T>) => {
  return (
    <div className={cx('tab-list', size)}>
      {tabs.map((tab) => (
        <Tab
          key={tab.label}
          label={tab.label}
          value={tab.value}
          onClick={() => onChange(tab.value, tab)}
          isActive={tab.value === value}
          prefix={tab.prefix}
          suffix={tab.suffix}
          isLoading={tab.isLoading}
          size={size}
          count={tab.count}
          disabled={tab.disabled}
        />
      ))}
    </div>
  );
};
