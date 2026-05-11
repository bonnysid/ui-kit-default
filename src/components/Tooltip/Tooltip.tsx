import { FC, ReactNode, useRef } from 'react';
import { Popover, PopoverProps } from '@/components';
import { useOpenState } from '@/hooks';
import { bindStyles } from '@/utils';
import styles from './Tooltip.module.scss';

const cn = bindStyles(styles);

export type TooltipProps = Pick<PopoverProps, 'gap' | 'placement'> & {
  id?: string;
  text: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};

export const Tooltip: FC<TooltipProps> = ({
  id = 'tooltip',
  children,
  text,
  disabled,
  className,

  gap,
  placement,
}) => {
  const referenceRef = useRef<HTMLDivElement>(null);
  const popoverControls = useOpenState();

  const handleMouseEnter = () => {
    if (!disabled) {
      popoverControls.open();
    }
  };

  const handleMouseLeave = () => {
    popoverControls.close();
  };

  return (
    <div
      className={cn(className)}
      ref={referenceRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {popoverControls.isOpen && (
        <Popover
          className={cn('tooltip')}
          portalId={id}
          placement={placement}
          referenceRef={referenceRef}
          closeOnBlur
          closeOnResize
          closeOnMouseLeave
          closeOnScroll
          width={'min(fit-content, 100%)'}
          gap={gap}
          onClose={popoverControls.close}
        >
          {text}
        </Popover>
      )}
    </div>
  );
};
