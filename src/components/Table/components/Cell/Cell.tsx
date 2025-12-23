import { CSSProperties, FC, PropsWithChildren } from 'react';
import { bindStyles } from '@/utils';
import { ColumnAlignVariants, ColumnFixedVariants } from '../../types';
import styles from './Cell.module.scss';

const cx = bindStyles(styles);

export type CellProps = PropsWithChildren<{
  className?: string;
  fixed?: ColumnFixedVariants;
  align?: ColumnAlignVariants;
  paddingLeft?: number;
  left?: number;
  right?: number;
  withBorder?: boolean;
  withShadow?: boolean;
  isHead?: boolean;
}>;

export const Cell: FC<CellProps> = ({
  withBorder,
  withShadow,
  right,
  left,
  children,
  className,
  paddingLeft,
  fixed,
  isHead,
  align = ColumnAlignVariants.LEFT,
}) => {
  const style: CSSProperties = { paddingLeft, left, right };
  const classNames = cx(className, 'wrapper', fixed, `align_${align}`, {
    withBorder,
    withShadow,
  });

  if (isHead) {
    return (
      <th className={classNames} style={style}>
        {children}
      </th>
    );
  }

  return (
    <td className={classNames} style={style}>
      {children}
    </td>
  );
};
