import { FC, MouseEvent } from 'react';
import { bindStyles } from '@/utils';

import { Icon, IconSize, IconTypes } from '../../../Icon';
import styles from './InputIcon.module.scss';

type Props = {
  type: IconTypes;
  onClick?: (e: MouseEvent<SVGSVGElement>) => void;
  disabled?: boolean;
  isPlaceholder?: boolean;
};

const cx = bindStyles(styles);

export const InputIcon: FC<Props> = ({ onClick, type, disabled, isPlaceholder }) => {
  return (
    <Icon
      className={cx('icon', { clickable: Boolean(onClick), disabled, isPlaceholder })}
      type={type}
      size={IconSize.LARGE}
      onClick={disabled ? undefined : onClick}
    />
  );
};
