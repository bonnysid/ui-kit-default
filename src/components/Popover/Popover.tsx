import {
  arrow,
  autoUpdate,
  flip,
  offset,
  Padding,
  Placement,
  shift,
  useFloating,
} from '@floating-ui/react';
import {
  ComponentProps,
  CSSProperties,
  createContext,
  FC,
  FocusEvent,
  MouseEvent,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { v4 } from 'uuid';

import { bindStyles } from '@/utils';

import { Portal } from '../Portal';
import styles from './Popover.module.scss';

const cn = bindStyles(styles);

export type PopoverSharedProps = {
  onClose?: () => void;
  withArrow?: boolean;
  shiftPadding?: Padding;
  placement?: Placement;
};

export type PopoverProps = ComponentProps<'div'> &
  PopoverSharedProps &
  PropsWithChildren<{
    activeIndex?: number;
    width?: number | string;
    className?: string;
    maxMenuHeight?: CSSProperties['maxHeight'];
    portalId?: string;
    mouseLeaveDelay?: number;
    scrollGraceDelay?: number;
    gap?: number;
    referenceRef: RefObject<HTMLElement | null>;

    closeOnScroll?: boolean;
    closeOnMouseLeave?: boolean;
    closeOnResize?: boolean;
    closeOnBlur?: boolean;
    closeOnClickOutside?: boolean;
  }>;

const DropdownGroupContext = createContext<string | null>(null);

const genGroupId = () => `ddg_${v4()}`;

export const Popover: FC<PopoverProps> = ({
  activeIndex,
  onClose,
  width,
  children,
  maxMenuHeight = 320,
  scrollGraceDelay = 180,
  className,
  closeOnBlur = false,
  portalId = 'popup-root',
  closeOnMouseLeave = false,
  mouseLeaveDelay = 120,
  onBlur,
  onClick,
  onMouseDown,
  gap = 8,
  shiftPadding = 8,

  referenceRef,
  placement = 'bottom-start',
  closeOnResize,
  closeOnScroll,
  closeOnClickOutside = true,
  withArrow,

  ...restProps
}) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const {
    refs,
    floatingStyles,
    middlewareData,
    placement: finalPlacement,
  } = useFloating({
    placement,
    middleware: [
      offset(gap),
      flip({ fallbackPlacements: ['top-start'] }),
      shift({ padding: shiftPadding }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
    open: true,
  });

  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[finalPlacement.split('-')[0]] as string;

  const parentGroupId = useContext(DropdownGroupContext);
  const groupIdRef = useRef<string>(parentGroupId ?? genGroupId());
  const groupId = groupIdRef.current;

  const isSameGroup = useCallback(
    (node: Node | null) => {
      const el =
        node && (node as Element).closest ? (node as Element).closest('[data-dd-root]') : null;
      const gid = (el as HTMLElement | null)?.getAttribute?.('data-dd-group');
      return gid === groupId;
    },
    [groupId],
  );

  const hoverTimerRef = useRef<number | null>(null);
  const hoverStateRef = useRef<{ anchor: boolean; dropdown: boolean }>({
    anchor: false,
    dropdown: false,
  });

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  const isScrollingRef = useRef(false);

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!closeOnBlur) return;
    const next = e.relatedTarget as Node | null;
    if (isSameGroup(next)) return;
    onClose?.();

    onBlur?.(e);
  };

  const scheduleMaybeClose = useCallback(() => {
    if (!closeOnMouseLeave) return;
    clearHoverTimer();

    if (isScrollingRef.current) return;

    if (!hoverStateRef.current.anchor && !hoverStateRef.current.dropdown) {
      hoverTimerRef.current = window.setTimeout(() => {
        if (
          !hoverStateRef.current.anchor &&
          !hoverStateRef.current.dropdown &&
          !isScrollingRef.current
        ) {
          onClose?.();
        }
      }, mouseLeaveDelay);
    }
  }, [closeOnMouseLeave, mouseLeaveDelay, onClose, clearHoverTimer]);

  useLayoutEffect(() => {
    const onResize = () => {
      if (closeOnResize) {
        onClose?.();
      }
    };

    const onScroll = () => {
      if (closeOnScroll) {
        onClose?.();
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, true);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [closeOnScroll, closeOnResize, onClose]);

  useEffect(() => {
    if (!closeOnMouseLeave) return;

    const reference = referenceRef.current;
    const popover = popoverRef.current;
    if (!reference) return;

    const onAnchorEnter = () => {
      hoverStateRef.current.anchor = true;
      clearHoverTimer();
    };

    const onAnchorLeave = (e: PointerEvent) => {
      const next = e.relatedTarget as Node | null;
      if (isSameGroup(next) || reference.contains(next) || !onClose) return;
      hoverTimerRef.current = window.setTimeout(onClose, mouseLeaveDelay);
    };

    const onDropdownEnter = () => {
      hoverStateRef.current.dropdown = true;
      clearHoverTimer();
    };

    const onDropdownLeave = (e: PointerEvent) => {
      const next = e.relatedTarget as Node | null;
      if (isSameGroup(next) || !onClose) return;
      hoverTimerRef.current = window.setTimeout(onClose, mouseLeaveDelay);
    };

    reference.addEventListener('pointerenter', onAnchorEnter, true);
    reference.addEventListener('pointerleave', onAnchorLeave, true);

    if (popover) {
      popover.addEventListener('pointerenter', onDropdownEnter, true);
      popover.addEventListener('pointerleave', onDropdownLeave, true);
    }

    return () => {
      clearHoverTimer();
      reference.removeEventListener('pointerenter', onAnchorEnter, true);
      reference.removeEventListener('pointerleave', onAnchorLeave, true);
      if (popover) {
        popover.removeEventListener('pointerenter', onDropdownEnter, true);
        popover.removeEventListener('pointerleave', onDropdownLeave, true);
      }
    };
  }, [
    closeOnMouseLeave,
    popoverRef,
    referenceRef,
    scheduleMaybeClose,
    clearHoverTimer,
    isSameGroup,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent['nativeEvent']) => {
      if (!closeOnClickOutside) {
        return;
      }

      const target = event.target as Node | null;
      if (!isSameGroup(target) && !referenceRef.current?.contains(target)) onClose?.();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSameGroup, onClose, closeOnClickOutside]);

  useEffect(() => {
    const onFocusOut = (e: FocusEvent['nativeEvent']) => {
      if (!closeOnBlur) {
        return;
      }

      const next = (e.relatedTarget as Node | null) ?? (document.activeElement as Node | null);
      if (isSameGroup(next)) return;
      onClose?.();
    };

    document.addEventListener('focusout', onFocusOut, true);
    return () => document.removeEventListener('focusout', onFocusOut, true);
  }, [closeOnBlur, isSameGroup, onClose]);

  useLayoutEffect(() => {
    if (referenceRef.current) {
      refs.setReference(referenceRef.current);
    }
  }, [referenceRef, refs]);

  const setPopoverRef = useCallback(
    (node: HTMLDivElement | null) => {
      popoverRef.current = node;
      refs.setFloating(node);
    },
    [refs],
  );

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onMouseDown?.(e);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick?.(e);
  };

  const { x, y } = middlewareData.arrow ?? {};

  const content = (
    <div
      data-dd-root
      data-dd-group={groupId}
      className={cn(className, 'popover')}
      ref={setPopoverRef}
      tabIndex={-1}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onBlur={handleBlur}
      {...restProps}
      style={{
        ...floatingStyles,
        width: width ?? referenceRef.current?.offsetWidth,
        maxHeight: maxMenuHeight,
      }}
    >
      {children}

      {withArrow && (
        <div
          ref={arrowRef}
          className={cn('arrow', finalPlacement.split('-')[0])}
          style={{
            left: x != null ? `${x}px` : '',
            top: y != null ? `${y}px` : '',
            right: '',
            bottom: '',
            [staticSide]: '-4px',
          }}
        ></div>
      )}
    </div>
  );

  if (parentGroupId) {
    return <Portal id={portalId}>{content}</Portal>;
  }

  return (
    <DropdownGroupContext.Provider value={groupId}>
      <Portal id={portalId}>{content}</Portal>
    </DropdownGroupContext.Provider>
  );
};
