import { CSSProperties, FC, ReactNode } from 'react';
import { bindStyles } from '@/utils';

import styles from './Skeleton.module.scss';

const cx = bindStyles(styles);

export enum SkeletonVariants {
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
}

export type SkeletonProps = {
  variant?: SkeletonVariants;
  width?: string | number;
  height?: string | number;
  className?: string;
  borderRadius?: string | number;
  children?: ReactNode;
  isAnimated?: boolean;
};

export const Skeleton: FC<SkeletonProps> = ({
  variant = SkeletonVariants.RECTANGLE,
  width,
  height,
  className,
  borderRadius,
  children,
  isAnimated = true,
}) => {
  const style: CSSProperties = {
    width,
    height,
    borderRadius,
  };

  return (
    <div
      className={cx('skeleton', variant, className, {
        animated: isAnimated,
      })}
      style={style}
    >
      {children}
    </div>
  );
};
