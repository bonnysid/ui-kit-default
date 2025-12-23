import { FC, ReactNode, useRef } from 'react';
import { Icon, TextShorter, Tooltip } from '@/components';
import { bindStyles } from '@/utils';
import { Sort, SortDirectionsVariants } from '../../types';
import { Cell, CellProps } from '../Cell';
import styles from './HeadCell.module.scss';

const cx = bindStyles(styles);

type Props = Omit<CellProps, 'isHead'> & {
  onClick?: () => void;
  sortable?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  tooltip?: ReactNode;
  withTooltipIcon?: boolean;
  sortDirection?: Sort<string>['order'];
};

export const HeadCell: FC<Props> = ({
  className,
  children,
  onClick,
  isActive,
  disabled,
  sortable,
  sortDirection,
  tooltip,
  withTooltipIcon,
  ...rest
}) => {
  const contentRef = useRef<HTMLButtonElement>(null);

  const handleMouseLeave = () => {
    contentRef.current?.blur();
  };

  return (
    <Cell isHead className={cx(className, 'wrapper')} {...rest}>
      <button
        type="button"
        className={cx('content', {
          clickable: sortable || Boolean(onClick),
          isActive,
        })}
        onClick={onClick}
        disabled={disabled}
        ref={contentRef}
        onMouseLeave={handleMouseLeave}
      >
        {tooltip && !withTooltipIcon ? (
          <Tooltip text={tooltip}>
            <TextShorter tooltip className={cx('text')}>
              {children}
            </TextShorter>
          </Tooltip>
        ) : (
          <TextShorter tooltip className={cx('text')}>
            {children}
          </TextShorter>
        )}

        {tooltip && withTooltipIcon && (
          <Tooltip text={tooltip}>
            <Icon type="circle-information" />
          </Tooltip>
        )}
        {sortable && (
          <Icon
            className={cx('sort-icon', { isUp: sortDirection === SortDirectionsVariants.ASC })}
            type="arrow-down"
          />
        )}
      </button>
    </Cell>
  );
};
