import { ColumnWidthType } from '../types';

export const formatWidth = (width: ColumnWidthType) => {
  if (typeof width === 'number') {
    return `${width}px`;
  }

  return width;
};
