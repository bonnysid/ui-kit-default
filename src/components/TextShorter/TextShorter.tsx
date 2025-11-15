import React, { PropsWithChildren, useState } from 'react';

import { bindStyles } from '@/utils';

import { Tooltip } from '../Tooltip';

import styles from './TextShorter.module.scss';

export type TextShorterProps = PropsWithChildren<{
  className?: string;
  tooltip?: boolean;
  tooltipId?: string;
}>;

const cn = bindStyles(styles);

export const TextShorter: React.FC<TextShorterProps> = ({
  tooltip = true,
  className,
  children,
  tooltipId,
}) => {
  const tooltipContent = <>{children}</>;

  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const onMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setShowTooltip(event.currentTarget.scrollWidth > event.currentTarget.clientWidth);
  };

  if (tooltip && showTooltip) {
    return (
      <div className={cn(className, 'text-shorter')}>
        <Tooltip id={tooltipId} text={tooltipContent}>
          <div className={cn('content')} onMouseEnter={tooltip ? onMouseEnter : undefined}>
            {children}
          </div>
        </Tooltip>
      </div>
    );
  }

  return (
    <div
      className={cn(className, 'content', 'text-shorter')}
      onMouseEnter={tooltip ? onMouseEnter : undefined}
    >
      {children}
    </div>
  );
};
