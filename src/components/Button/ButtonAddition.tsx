import { FC, ReactNode } from 'react';

import { Icon, IconTypes } from '@/components';
import { bindStyles } from '@/utils';

import styles from './Button.module.scss';

type Props = {
  icon: IconTypes | ReactNode;
};

const cx = bindStyles(styles);

export const ButtonAddition: FC<Props> = ({ icon }) => {
  if (typeof icon === 'string') {
    return <Icon type={icon as IconTypes} className={cx('icon')} />;
  }

  return icon;
};
