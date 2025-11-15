import { FC } from 'react';

import { bindStyles } from '@/utils';

import { Icon, IconSize } from '../../../Icon';
import styles from './NumberControls.module.scss';

type Props = {
  increment: () => void;
  decrement: () => void;
};

const cx = bindStyles(styles);

export const NumberControls: FC<Props> = ({ decrement, increment }) => {
  return (
    <div className={cx('container')}>
      <button type="button" className={cx('button')} onClick={increment}>
        <Icon className={cx('icon')} type="chevron" size={IconSize.SMALL} />
      </button>
      <div className={cx('divider')} />
      <button type="button" className={cx('button')} onClick={decrement}>
        <Icon className={cx('icon', 'rotate')} type="chevron" size={IconSize.SMALL} />
      </button>
    </div>
  );
};
