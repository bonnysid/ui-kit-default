import { clamp } from '@/utils/clamp';

export enum PlacementSide {
  TOP = 'top',
  RIGHT = 'right',
  LEFT = 'left',
  BOTTOM = 'bottom',
}

export enum PlacementAlignment {
  START = 'start',
  CENTER = 'center',
  END = 'end',
}

export type ComputeCoordsFromPlacementProps = {
  reference: HTMLElement;
  popover: HTMLElement;
  gap?: number;

  placementSide?: PlacementSide;
  placementAlignment?: PlacementAlignment;
  isPortal?: boolean;
};

export const computeCoordsFromPlacement = ({
  placementSide,
  placementAlignment,
  gap = 8,
  popover,
  reference,
  isPortal,
}: ComputeCoordsFromPlacementProps) => {
  let side: PlacementSide;
  let align: PlacementAlignment;

  const isAutoSide = placementSide === undefined;
  const isAutoAlign = placementAlignment === undefined;

  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;
  const popoverRect = popover.getBoundingClientRect();
  const referenceRect = reference.getBoundingClientRect();

  const needHeight = popoverRect.height + gap;
  const topAvailableHeight = referenceRect.top;
  const bottomAvailableHeight = containerHeight - referenceRect.bottom;

  if (isAutoSide) {
    if (bottomAvailableHeight >= needHeight) {
      side = PlacementSide.BOTTOM;
    } else if (topAvailableHeight >= needHeight) {
      side = PlacementSide.TOP;
    } else {
      side = PlacementSide.BOTTOM;
    }
  } else {
    side = placementSide;
  }

  const isVertical = side === PlacementSide.TOP || side === PlacementSide.BOTTOM;
  const rightAvailableWidth = isVertical
    ? containerWidth - referenceRect.left
    : containerWidth - referenceRect.right;
  const leftAvailableWidth = isVertical ? referenceRect.right : referenceRect.left;
  const needWidth = isVertical ? popoverRect.width : popoverRect.width + gap;

  if (isAutoAlign) {
    if (rightAvailableWidth >= needWidth) {
      align = PlacementAlignment.START;
    } else if (leftAvailableWidth >= needWidth) {
      align = PlacementAlignment.END;
    } else {
      align = PlacementAlignment.CENTER;
    }
  } else {
    align = placementAlignment;
  }

  let x: number = 0;
  let y: number = 0;

  if (isVertical) {
    if (side === PlacementSide.TOP) {
      if (isPortal) {
        y = referenceRect.y - popoverRect.height - gap;
      } else {
        y = -referenceRect.height - gap - popoverRect.height;
      }
    }

    if (side === PlacementSide.BOTTOM) {
      if (isPortal) {
        y = referenceRect.y + referenceRect.height + gap;
      } else {
        y = referenceRect.height + gap;
      }
    }

    if (align === PlacementAlignment.START) {
      if (isPortal) {
        x = referenceRect.x;
      } else {
        x = 0;
      }
    }

    if (align === PlacementAlignment.END) {
      if (isPortal) {
        x = referenceRect.x + referenceRect.width - popoverRect.width;
      } else {
        x = referenceRect.width;
      }
    }

    if (align === PlacementAlignment.CENTER) {
      if (isPortal) {
        x = referenceRect.x + referenceRect.width / 2 - popoverRect.width / 2;
      } else {
        x = referenceRect.width / 2 - popoverRect.width / 2;
      }
    }
  } else {
    if (side === PlacementSide.LEFT) {
      if (isPortal) {
        x = referenceRect.y - popoverRect.width - gap;
      } else {
        x = -popoverRect.width - gap;
      }
    }

    if (side === PlacementSide.RIGHT) {
      if (isPortal) {
        x = referenceRect.y + referenceRect.width + gap;
      } else {
        x = referenceRect.width + gap;
      }
    }

    if (align === PlacementAlignment.START) {
      if (isPortal) {
        y = referenceRect.y;
      } else {
        y = 0;
      }
    }

    if (align === PlacementAlignment.END) {
      if (isPortal) {
        y = referenceRect.y + referenceRect.height - popoverRect.height;
      } else {
        y = referenceRect.height;
      }
    }

    if (align === PlacementAlignment.CENTER) {
      if (isPortal) {
        y = referenceRect.y + referenceRect.height / 2 - popoverRect.height / 2;
      } else {
        y = referenceRect.height / 2 - popoverRect.height / 2;
      }
    }
  }

  y = clamp(y, 0, containerHeight - popoverRect.height);
  x = clamp(x, 0, containerWidth - popoverRect.width);

  return {
    x,
    y,
    side,
    align,
  };
};

export type ComputeCoordsFromPlacementReturn = ReturnType<typeof computeCoordsFromPlacement>;
