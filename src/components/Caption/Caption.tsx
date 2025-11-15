import { ReactNode } from 'react';
import { Icon, Tooltip } from '@/components';
import { bindStyles, PlacementSide } from '@/utils';
import styles from './Caption.module.scss';

export type CaptionProps = {
  caption: string;
  hint?: string | ReactNode;
};

const cx = bindStyles(styles);

export const Caption = ({ caption, hint }: CaptionProps) => {
  return (
    <div className={cx('caption')}>
      {caption}
      {hint && (
        <Tooltip text={hint} placementSide={PlacementSide.TOP}>
          <Icon type="circle-help" className={cx('icon', 'hint')} />
        </Tooltip>
      )}
    </div>
  );
};
