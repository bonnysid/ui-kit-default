import { RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  ComputeCoordsFromPlacementProps,
  ComputeCoordsFromPlacementReturn,
  computeCoordsFromPlacement,
} from '@/utils';

export type UseFloatingProps = Omit<ComputeCoordsFromPlacementProps, 'popover' | 'reference'> & {
  computeOnResize?: boolean;
  computeOnScroll?: boolean;

  popoverRef: RefObject<HTMLElement | null>;
  referenceRef: RefObject<HTMLElement | null>;
};

export const useFloating = ({
  computeOnScroll,
  computeOnResize,
  gap,
  placementAlignment,
  placementSide,
  popoverRef,
  referenceRef,
  isPortal,
}: UseFloatingProps) => {
  const rafIdRef = useRef<number | null>(null);
  const [computed, setComputed] = useState<ComputeCoordsFromPlacementReturn | undefined>();

  const recalc = useCallback(() => {
    if (popoverRef.current && referenceRef.current) {
      setComputed(
        computeCoordsFromPlacement({
          gap,
          reference: referenceRef.current,
          popover: popoverRef.current,
          placementSide,
          placementAlignment,
          isPortal,
        }),
      );
    }
  }, [gap, referenceRef, popoverRef, referenceRef, placementAlignment, placementSide, isPortal]);

  useLayoutEffect(() => {
    if (!popoverRef.current || !referenceRef.current) return;

    let r1 = 0;
    let r2 = 0;
    r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => recalc());
    });

    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [recalc]);

  useLayoutEffect(() => {
    if (computeOnResize) {
      window.addEventListener('resize', recalc);
    }

    return () => {
      window.removeEventListener('resize', recalc);
    };
  }, [computeOnResize]);

  useLayoutEffect(() => {
    let observer: ResizeObserver | null = null;

    if (popoverRef.current) {
      observer = new ResizeObserver(() => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(recalc);
      });
      observer.observe(popoverRef.current);
    }

    return () => {
      observer?.disconnect();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  useLayoutEffect(() => {
    if (computeOnScroll) {
      window.addEventListener('scroll', recalc, true);
    }

    return () => {
      window.removeEventListener('scroll', recalc, true);
    };
  }, [computeOnScroll]);

  return { computed, recalc };
};
