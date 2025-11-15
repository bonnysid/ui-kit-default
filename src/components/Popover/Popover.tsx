import {
  ComponentProps,
  CSSProperties,
  createContext,
  FC,
  FocusEvent,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { v4 } from 'uuid';
import { UseFloatingProps, useFloating } from '@/hooks';
import { bindStyles } from '@/utils';
import { Portal } from '../Portal';
import styles from './Popover.module.scss';

const cn = bindStyles(styles);

export type PopoverSharedProps = Omit<
  UseFloatingProps,
  'popoverRef' | 'computeOnResize' | 'computeOnScroll'
> & {
  onClose: () => void;
};

export type PopoverProps = ComponentProps<'div'> &
  PopoverSharedProps &
  PropsWithChildren<{
    activeIndex?: number;
    width?: number | string;
    className?: string;
    onClose: () => void;
    maxMenuHeight?: CSSProperties['maxHeight'];
    portalId?: string;
    mouseLeaveDelay?: number;
    scrollGraceDelay?: number;

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
  gap,
  closeOnBlur = false,
  portalId = 'popup-root',
  closeOnMouseLeave = false,
  mouseLeaveDelay = 120,
  onBlur,
  onClick,
  onMouseDown,

  isPortal = true,
  referenceRef,
  placementSide,
  placementAlignment,
  closeOnResize,
  closeOnScroll,
  closeOnClickOutside = true,

  ...restProps
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { computed } = useFloating({
    computeOnResize: !closeOnResize,
    computeOnScroll: !closeOnScroll,
    popoverRef,
    referenceRef,
    placementSide,
    placementAlignment,
    gap,
    isPortal,
  });
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
    onClose();

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
          onClose();
        }
      }, mouseLeaveDelay);
    }
  }, [closeOnMouseLeave, mouseLeaveDelay, onClose, clearHoverTimer]);

  useLayoutEffect(() => {
    const onResize = () => {
      if (closeOnResize) {
        onClose();
      }
    };

    const onScroll = () => {
      if (closeOnScroll) {
        onClose();
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
      if (isSameGroup(next) || reference.contains(next)) return;
      hoverTimerRef.current = window.setTimeout(onClose, mouseLeaveDelay);
    };

    const onDropdownEnter = () => {
      hoverStateRef.current.dropdown = true;
      clearHoverTimer();
    };

    const onDropdownLeave = (e: PointerEvent) => {
      const next = e.relatedTarget as Node | null;
      if (isSameGroup(next)) return;
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
      if (!isSameGroup(target) && !referenceRef.current?.contains(target)) onClose();
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
      onClose();
    };

    document.addEventListener('focusout', onFocusOut, true);
    return () => document.removeEventListener('focusout', onFocusOut, true);
  }, [closeOnBlur, isSameGroup, onClose]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onMouseDown?.(e);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick?.(e);
  };

  const content = (
    <div
      data-dd-root
      data-dd-group={groupId}
      className={cn(className, 'popover')}
      ref={popoverRef}
      tabIndex={-1}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onBlur={handleBlur}
      {...restProps}
      style={{
        ...restProps.style,
        top: computed?.y || 0,
        left: computed?.x || 0,
        visibility: computed ? 'visible' : 'hidden',
        width: width ?? referenceRef.current?.offsetWidth,
        maxHeight: maxMenuHeight,
      }}
    >
      {children}
    </div>
  );

  if (parentGroupId) {
    if (isPortal) {
      return <Portal id={portalId}>{content}</Portal>;
    }

    return content;
  }

  return (
    <DropdownGroupContext.Provider value={groupId}>
      {isPortal ? <Portal id={portalId}>{content}</Portal> : content}
    </DropdownGroupContext.Provider>
  );
};
