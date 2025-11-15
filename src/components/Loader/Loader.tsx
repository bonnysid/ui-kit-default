import { FC } from 'react';
import { Icon, IconSize, IconTypes } from '@/components';
import { bindStyles } from '@/utils';

import styles from './Loader.module.scss';

type Props = {
  size?: IconSize | number;
  type?: Extract<IconTypes, 'spinner' | 'spinner-progress' | 'spinner-filled'>;
  className?: string;
};

const cx = bindStyles(styles);

export const Loader: FC<Props> = ({
  size = IconSize.LARGE,
  className,
  type = 'spinner-filled',
}) => {
  return <Icon data-testid="loader" type={type} size={size} className={cx(className, 'loader')} />;
};
