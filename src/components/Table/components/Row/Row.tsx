import { MouseEvent, memo, useCallback, useMemo } from 'react';
import { Button, ButtonSizes, ButtonVariants, Icon } from '@/components';
import { useOpenState } from '@/hooks';
import { bindStyles } from '@/utils';
import { ColumnFixedVariants, RowKeyFn, Sort, TableColumnType } from '../../types';
import { Cell } from '../Cell';
import { HeadCell } from '../HeadCell';
import styles from './Row.module.scss';

const cx = bindStyles(styles);

export enum RowVariants {
  HEAD_ROW = 'head',
  ROW = 'row',
}

type Props<D> = {
  columns: TableColumnType<D>[];
  item?: D;
  className?: string;
  variant?: RowVariants;
  sort?: Sort<D>;
  onChangeSort?: (column: TableColumnType<D>) => void;
  level?: number;
  hasItemsWithChildren?: boolean;
  hasScroll?: boolean;
  disabled?: boolean;
  onRowClick?: (item: D) => void;
  rowKey: RowKeyFn<D>;
  parentKey?: string;
  rowIndex?: number;
};

const DEFAULT_CELL_PADDING_LEFT = 8;
const ARROW_WIDTH = 24;
const CELL_GAP = 8;
const SUM_CONTROL_WIDTH = ARROW_WIDTH + CELL_GAP;

// Типизация компонента с memo
const RowComponent = <D extends { children?: D[] }>({
  className,
  onRowClick,
  item,
  hasItemsWithChildren,
  hasScroll,
  columns,
  variant = RowVariants.ROW,
  sort,
  disabled,
  onChangeSort,
  rowKey,
  level = 1,
  parentKey,
  rowIndex,
}: Props<D>) => {
  const { isOpen, toggle } = useOpenState();
  const hasChildren = Boolean(item?.children?.length);

  const currentKey = useMemo(() => {
    const key = item ? rowKey(item) : '';

    return parentKey ? `${parentKey}_${key}` : key;
  }, [item, rowKey, parentKey]);

  const renderedChildren = useMemo(() => {
    if (!isOpen || !hasChildren) {
      return null;
    }

    const hasChildrenInChildren = item?.children?.some((child) => Boolean(child.children?.length));

    const rowKeyChildren: RowKeyFn<D> = (row: D) => {
      return `${currentKey}_${rowKey(row)}`;
    };

    return item?.children?.map((child) => {
      return (
        <Row<D>
          key={rowKeyChildren(child)}
          onRowClick={onRowClick}
          rowKey={rowKey}
          parentKey={currentKey}
          columns={columns}
          item={child}
          level={level + 1}
          hasItemsWithChildren={hasChildrenInChildren}
          hasScroll={hasScroll}
        />
      );
    });
  }, [columns, onRowClick, item?.children, isOpen, level, hasScroll, rowKey, hasChildren]);

  const handleClickButton = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggle();
  }, []);

  const renderedColumns = useMemo(() => {
    const columnsLeftFixed = columns
      .filter((col) => col.fixed === ColumnFixedVariants.LEFT)
      .map((col) => ({ ...col, left: 0 }))
      .map((col, i, arr) => {
        const prev = arr[i - 1];
        const prevWidth = prev?.width || prev?.minWidth || prev?.maxWidth;

        return {
          ...col,
          left: i === 0 ? 0 : (prev?.left ?? 0) + (Number(prevWidth) || 0),
          width: arr[i].width,
        };
      })
      .reverse();
    const columnsRightFixed = columns
      .filter((col) => col.fixed === ColumnFixedVariants.RIGHT)
      .map((col) => ({ ...col, right: 0 }))
      .reverse()
      .map((col, i, arr) => {
        const prev = arr[i - 1];
        const prevWidth = prev?.width || prev?.minWidth || prev?.maxWidth;

        return {
          ...col,
          right: i === 0 ? 0 : (prev?.right ?? 0) + (Number(prevWidth) || 0),
          width: arr[i].width,
        };
      })
      .reverse();

    return columns.map((col, i) => {
      const column: TableColumnType<D> & { left?: number; right?: number } =
        columnsLeftFixed.find((colLeft) => colLeft.key === col.key) ||
        columnsRightFixed.find((colRight) => colRight.key === col.key) ||
        col;
      const leftIndex = columnsLeftFixed.findIndex((colLeft) => colLeft.key === column.key);
      const index =
        leftIndex === -1
          ? columnsRightFixed.findIndex((colRight) => colRight.key === column.key)
          : leftIndex;

      const firstCell = i === 0;
      const withBorderAndShadow = column.fixed && hasScroll ? index === 0 : undefined;
      const left = column.fixed !== ColumnFixedVariants.LEFT ? undefined : column.left;
      const right = column.fixed !== ColumnFixedVariants.RIGHT ? undefined : column.right;

      if (variant === RowVariants.HEAD_ROW) {
        return (
          <HeadCell
            key={String(column.key)}
            className={cx('header-cell')}
            onClick={column.sortable ? () => onChangeSort?.(column) : undefined}
            sortable={column.sortable}
            isActive={column.key === sort?.column}
            sortDirection={sort?.order}
            fixed={column.fixed}
            left={left}
            right={right}
            align={column.align}
            disabled={disabled}
            tooltip={column.tooltip}
            withTooltipIcon={column.withTooltipIcon}
            withBorder={withBorderAndShadow}
            withShadow={withBorderAndShadow}
          >
            {column.title ?? String(column.key)}
          </HeadCell>
        );
      }

      let paddingLeft = DEFAULT_CELL_PADDING_LEFT;

      if (hasItemsWithChildren && firstCell) {
        if (hasChildren) {
          paddingLeft = DEFAULT_CELL_PADDING_LEFT + SUM_CONTROL_WIDTH * (level - 1);
        } else {
          paddingLeft = DEFAULT_CELL_PADDING_LEFT + SUM_CONTROL_WIDTH * level;
        }
      }

      if (variant === RowVariants.ROW && item) {
        const className =
          typeof column.className === 'function' ? column.className(item) : column.className;

        return (
          <Cell
            key={rowKey(item) + String(column.key)}
            paddingLeft={paddingLeft}
            fixed={column.fixed}
            align={column.align}
            className={className}
            left={left}
            right={right}
            withBorder={withBorderAndShadow}
            withShadow={withBorderAndShadow}
          >
            {hasChildren && firstCell && (
              <Button
                size={ButtonSizes.SMALL}
                variant={ButtonVariants.TERTIARY}
                onClick={handleClickButton}
                prefix={
                  <Icon type="chevron" className={cx('chevron-icon', { isOpened: isOpen })} />
                }
              />
            )}
            {column.render
              ? column.render(
                  item[column.key as keyof D] as D[keyof D] & undefined,
                  item,
                  rowIndex ?? 0,
                )
              : item[column.key as keyof typeof item]
                ? String(item[column.key as keyof typeof item])
                : null}
          </Cell>
        );
      }

      return null;
    });
  }, [
    columns,
    hasScroll,
    variant,
    hasItemsWithChildren,
    item,
    sort?.column,
    sort?.order,
    onChangeSort,
    level,
    hasChildren,
    handleClickButton,
    isOpen,
    disabled,
  ]);

  return (
    <>
      <tr
        className={cx(className, 'wrapper', { clickable: Boolean(onRowClick) })}
        onClick={() => item && onRowClick?.(item)}
      >
        {renderedColumns}
      </tr>
      {renderedChildren}
    </>
  );
};

// Оборачиваем компонент в memo и типизируем
export const Row = memo(RowComponent) as typeof RowComponent & { displayName: string };
Row.displayName = 'Row';
