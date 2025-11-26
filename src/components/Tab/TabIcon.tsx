import { FC, ReactElement } from 'react';

import { bindStyles } from '@/utils';

import { Icon, IconTypes } from '../Icon';
import styles from './Tab.module.scss';

const cx = bindStyles(styles);

type TabIconProps = {
  isActive?: boolean;
  icon: IconTypes | ReactElement;
};

export const TabIcon: FC<TabIconProps> = ({ icon, isActive }) => {
  return (
    <div className={cx('icon', { isActive })}>
      {typeof icon === 'string' ? <Icon type={icon} /> : icon}
    </div>
  );
};
