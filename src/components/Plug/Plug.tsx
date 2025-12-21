import { FC, HTMLAttributes } from 'react';
import { bindStyles } from '@/utils';

import styles from './Plug.module.scss';

type PlugProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  text?: string;
};

const cx = bindStyles(styles);

export const Plug: FC<PlugProps> = ({ className, title, text, children, ...props }) => {
  return (
    <div className={cx(className, 'plug')} {...props}>
      {title && <h2 className={cx('title')}>{title}</h2>}
      {text && <p className={cx('text')}>{text}</p>}
      {children}
    </div>
  );
};
