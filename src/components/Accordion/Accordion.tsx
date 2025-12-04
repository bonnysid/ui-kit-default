import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  MouseEvent,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { Icon } from '@/components';
import { useOpenState } from '@/hooks';
import { bindStyles } from '@/utils';
import styles from './Accordion.module.scss';

const cn = bindStyles(styles);

type DefaultDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

type OwnProps = PropsWithChildren<{
  header: ReactNode | string;
  onHeaderClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  contentClassName?: string;
  isEmptyContent?: boolean;
  isDefaultOpen?: boolean;
  isWithoutArrow?: boolean;
}>;

export type AccordionProps = Omit<DefaultDivProps, keyof OwnProps> & OwnProps;

export const Accordion: FC<AccordionProps> = ({
  header,
  onHeaderClick,
  contentClassName,
  isEmptyContent,
  isDefaultOpen,
  isWithoutArrow,
  children,
  className,

  ...restProps
}) => {
  const isEmpty = isEmptyContent || !children;
  const accordionControls = useOpenState(isDefaultOpen);

  const onClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    onHeaderClick?.(e);
    if (!isEmpty) {
      accordionControls.toggle();
    }
  };

  return (
    <div className={cn(className, 'accordion')} {...restProps}>
      <button
        type="button"
        className={cn('header', { isEmptyContent: isEmpty })}
        onClick={onClickHandler}
      >
        <div className={cn('header-left')}>{header}</div>

        {!isEmpty && !isWithoutArrow && (
          <Icon type="chevron" className={cn('icon', { isOpened: accordionControls.isOpen })} />
        )}
      </button>
      <div className={cn('gridWrap', { isOpened: accordionControls.isOpen })}>
        <div
          className={cn('content', contentClassName, {
            isOpened: accordionControls.isOpen,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
