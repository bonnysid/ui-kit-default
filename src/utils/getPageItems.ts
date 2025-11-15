export type PageItem = number | '…';

const rng = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);

/**
 * boundaryCount — сколько страниц у краёв
 * siblingCount  — сколько соседей вокруг текущей
 */
export function getPageItems(totalPages: number, current: number, boundaryCount = 1, siblingCount = 1): PageItem[] {
  if (totalPages <= 0) return [];

  const maxVisible = boundaryCount * 2 + siblingCount * 2 + 3;
  if (totalPages <= maxVisible) return rng(1, totalPages);

  const startPages = rng(1, boundaryCount);
  const endPages = rng(totalPages - boundaryCount + 1, totalPages);

  const windowSize = boundaryCount + 2 * siblingCount;

  // ----- край слева: показываем первые windowSize и последние windowSize -----
  if (current <= boundaryCount + siblingCount) {
    const leftFull = rng(1, windowSize);
    const rightFull = rng(totalPages - windowSize + 1, totalPages);
    return [...leftFull, '…', ...rightFull];
  }

  // ----- край справа -----
  if (current >= totalPages - boundaryCount - siblingCount + 1) {
    const leftFull = rng(1, windowSize);
    const rightFull = rng(totalPages - windowSize + 1, totalPages);
    return [...leftFull, '…', ...rightFull];
  }

  // ----- середина -----
  const middleStart = Math.max(current - siblingCount, boundaryCount + 1);
  const middleEnd = Math.min(current + siblingCount, totalPages - boundaryCount);

  const items: PageItem[] = [];
  items.push(...startPages);

  const gapLeft = middleStart - startPages[startPages.length - 1];
  if (gapLeft === 2) items.push(middleStart - 1);
  else if (gapLeft > 2) items.push('…');

  items.push(...rng(middleStart, middleEnd));

  const gapRight = endPages[0] - middleEnd;
  if (gapRight === 2) items.push(middleEnd + 1);
  else if (gapRight > 2) items.push('…');

  items.push(...endPages);
  return items;
}
