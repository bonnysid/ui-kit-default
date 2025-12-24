import { ReactNode } from 'react';

export enum ColumnFixedVariants {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum ColumnAlignVariants {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export enum SortDirectionsVariants {
  ASC = 'asc',
  DESC = 'desc',
}

export type Sort<D = string> = {
  column: keyof D;
  order: SortDirectionsVariants;
};

export type ColumnWidthType = string | number | undefined;

export type ColumnClassname<D> = string | ((record: D) => string);

export type DefaultColumnType<D> = {
  title?: ReactNode;
  sortable?: boolean;
  fixed?: ColumnFixedVariants;
  align?: ColumnAlignVariants;
  width?: ColumnWidthType;
  maxWidth?: ColumnWidthType;
  minWidth?: ColumnWidthType;
  tooltip?: ReactNode;
  withTooltipIcon?: boolean;
  className?: ColumnClassname<D>;
};

export type KnownColumnType<D, K extends keyof D = keyof D> = DefaultColumnType<D> & {
  key: K;
  render?: (value: D[K], record: D, index: number) => ReactNode;
};

export type CustomColumnType<D> = DefaultColumnType<D> & {
  key: `custom-column-${string}`;
  render?: (value: undefined, record: D, index: number) => ReactNode;
};

export type TableColumnKey<D> = KnownColumnType<D>['key'] | CustomColumnType<D>['key'];

export type TableColumnType<D> =
  | {
      [K in keyof D]: KnownColumnType<D, K>;
    }[keyof D]
  | CustomColumnType<D>;

export type RowKeyFn<D> = (item: D) => string;

export type TableDataItem<D> = D & { children?: D[] };
