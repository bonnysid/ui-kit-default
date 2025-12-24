import { memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUIKitTranslation } from '@/hooks';
import { bindStyles } from '@/utils';
import { Plug } from '../Plug';
import { Pagination, Row, RowVariants } from './components';
import { UsePaginationReturn, UseSortReturn } from './hooks';
import styles from './Table.module.scss';
import { RowKeyFn, TableColumnType, TableDataItem } from './types';
import { formatWidth } from './utils';

export type TableProps<D> = {
  columns: TableColumnType<D>[];
  data?: D[];

  emptyPlug?: ReactNode;
  emptyPlugTitle?: string;
  emptyPlugText?: string;

  loadingPlug?: ReactNode;
  loadingPlugTitle?: string;
  loadingPlugText?: string;

  pagination?: UsePaginationReturn;
  sort?: UseSortReturn<D>;

  isLoading?: boolean;
  isFetching?: boolean;
  sticky?: boolean;
  isEmpty?: boolean;
  withoutWrapper?: boolean;
  onRowClick?: (item: D) => void;
  rowKey: RowKeyFn<D>;
  onReset?: () => void;
};

const cx = bindStyles(styles);

const TableComponent = <D,>({
  columns,

  emptyPlug,
  emptyPlugTitle,
  emptyPlugText,

  sticky,
  isEmpty,
  isFetching,
  isLoading,

  loadingPlug,
  loadingPlugTitle,
  loadingPlugText,

  sort,
  pagination,
  withoutWrapper,
  onRowClick,
  rowKey,
  data,
  onReset,
}: TableProps<D>) => {
  const ref = useRef<HTMLTableElement>(null);
  const [hasScroll, setHasScroll] = useState(false);
  const showLoader = isFetching || isLoading;
  const showEmpty =
    (isEmpty ?? (!data?.length || (pagination && !pagination.totalItems))) && !showLoader;

  const disabled = isFetching || isLoading || isEmpty;
  const { t } = useUIKitTranslation();

  const handleChangeSort = useCallback(
    (column: TableColumnType<D>) => {
      if (sort) {
        sort.onChange(String(column.key));
      }
    },
    [sort],
  );

  const gridTemplateColumns = useMemo(() => {
    return columns
      .map((column) => {
        const formattedWidth = formatWidth(column.width);
        const formattedMinWidth = formatWidth(column.minWidth);
        const formattedMaxWidth = formatWidth(column.maxWidth);

        if (!formattedWidth && !formattedMinWidth && !formattedMaxWidth) {
          return '1fr';
        }

        return `minmax(${formattedMinWidth || formattedWidth}, ${
          formattedMaxWidth || formattedWidth || '1fr'
        })`;
      })
      .join(' ');
  }, [columns]);

  const rows = useMemo(() => {
    const hasItemsWithChildren = data?.some((it) =>
      Boolean((it as TableDataItem<D>)?.children?.length),
    );

    return data?.map((item) => {
      return (
        <Row<D>
          key={rowKey(item)}
          onRowClick={onRowClick}
          columns={columns}
          item={item}
          hasItemsWithChildren={hasItemsWithChildren}
          hasScroll={hasScroll}
          rowKey={rowKey}
        />
      );
    });
  }, [data, columns, onRowClick, hasScroll, rowKey]);

  const renderedHeader = useMemo(() => {
    return (
      <Row<D>
        variant={RowVariants.HEAD_ROW}
        columns={columns}
        onChangeSort={handleChangeSort}
        sort={sort?.value}
        hasScroll={hasScroll}
        rowKey={rowKey}
        disabled={disabled}
        className={cx('header-row')}
      />
    );
  }, [columns, sort?.value, handleChangeSort, hasScroll, rowKey, disabled]);

  useEffect(() => {
    const checkScroll = () => {
      if (ref.current) {
        setHasScroll(ref.current.scrollWidth > ref.current.clientWidth);
      }
    };

    const observer = new ResizeObserver(checkScroll);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer?.disconnect();
  }, []);

  const renderedEmptyPlug = useMemo(() => {
    if (emptyPlug) {
      return emptyPlug;
    }

    return (
      <Plug
        title={emptyPlugTitle ?? t('NoData')}
        text={emptyPlugText}
        className={cx('table-plug')}
      />
    );
  }, [emptyPlug, emptyPlugTitle, t, emptyPlugText, onReset]);

  const renderedLoadingPlug = useMemo(() => {
    if (loadingPlug) {
      return loadingPlug;
    }

    return (
      <Plug
        title={loadingPlugTitle ?? t('LoadingData')}
        text={loadingPlugText}
        className={cx('table-plug')}
      />
    );
  }, [loadingPlug, loadingPlugTitle, t, loadingPlugText]);

  return (
    <div className={cx('table-wrapper', { withoutWrapper })}>
      {showEmpty && renderedEmptyPlug}

      {!showEmpty && (
        <>
          <table className={cx('table', { showLoader })} style={{ gridTemplateColumns }} ref={ref}>
            <thead className={cx(`table-header`, { sticky })} style={{ gridTemplateColumns }}>
              {renderedHeader}
            </thead>
            <tbody className={cx('table-body', { hidden: showLoader })}>{rows}</tbody>
            {showLoader && renderedLoadingPlug}
          </table>
          {pagination && <Pagination pagination={pagination} sticky={sticky} disabled={disabled} />}
        </>
      )}
    </div>
  );
};

export const Table = memo(TableComponent) as typeof TableComponent & { displayName: string };

Table.displayName = 'Table';
