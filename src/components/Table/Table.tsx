import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { bindStyles } from '@cm/utils';
import { useAppTranslation } from '@cm/providers';

import { RowKeyFn, TableColumnType } from './types';
import { Pagination, Row, RowVariants } from './components';
import { formatWidth } from './utils';
import styles from './Table.module.scss';
import { UsePaginationReturn, UseSortReturn } from './hooks';
import { IllustrationVariant } from '../Illustration';
import { Plug, ResetPlug } from '../Plug';

type TableProps<D> = {
  columns: TableColumnType<D>[];
  data?: D[];

  emptyPlug?: ReactNode;
  emptyPlugVariant?: IllustrationVariant;
  emptyPlugTitle?: string;
  emptyPlugText?: string;

  loadingPlug?: ReactNode;
  loadingPlugVariant?: IllustrationVariant;
  loadingPlugTitle?: string;
  loadingPlugText?: string;

  pagination?: UsePaginationReturn;
  sort?: UseSortReturn<D>;

  isLoading?: boolean;
  isFetching?: boolean;
  isFiltering?: boolean;
  sticky?: boolean;
  isEmpty?: boolean;
  withoutWrapper?: boolean;
  onRowClick?: (item: D) => void;
  rowKey: RowKeyFn<D>;
  onReset?: () => void;
};

const cx = bindStyles(styles);

export const Table = <D,>({
  columns,

  emptyPlug,
  emptyPlugVariant,
  emptyPlugTitle,
  emptyPlugText,

  sticky,
  isEmpty,
  isFetching,
  isLoading,
  isFiltering,

  loadingPlug,
  loadingPlugVariant,
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
  const { t } = useAppTranslation();

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
    const hasItemsWithChildren = data?.some((it: { children?: D[] }) =>
      Boolean(it?.children?.length),
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
    if (isFiltering && onReset) {
      return (
        <ResetPlug
          onReset={onReset}
          className={cx('table-plug')}
        />
      );
    }

    if (emptyPlug) {
      return emptyPlug;
    }

    return (
      <Plug
        variant={emptyPlugVariant ?? IllustrationVariant.NO_DATA}
        title={emptyPlugTitle ?? t('table.plugs.empty.title')}
        text={emptyPlugText}
        className={cx('table-plug')}
      />
    );
  }, [isFiltering, emptyPlug, emptyPlugVariant, emptyPlugTitle, t, emptyPlugText, onReset]);

  const renderedLoadingPlug = useMemo(() => {
    if (loadingPlug) {
      return loadingPlug;
    }

    return (
      <Plug
        variant={loadingPlugVariant ?? IllustrationVariant.ROCKET}
        title={loadingPlugTitle ?? t('table.plugs.loading.title')}
        text={loadingPlugText}
        className={cx('table-plug')}
      />
    );
  }, [loadingPlug, loadingPlugVariant, loadingPlugTitle, t, loadingPlugText]);

  return (
    <div className={cx('table-wrapper', { withoutWrapper })}>
      {showEmpty && renderedEmptyPlug}

      {!showEmpty && (
        <>
          <table
            className={cx('table', { showLoader })}
            style={{ gridTemplateColumns }}
            ref={ref}
          >
            <thead
              className={cx(`table-header`, { sticky })}
              style={{ gridTemplateColumns }}
            >
              {renderedHeader}
            </thead>
            <tbody className={cx('table-body', { hidden: showLoader })}>{rows}</tbody>
            {showLoader && renderedLoadingPlug}
          </table>
          {pagination && (
            <Pagination
              pagination={pagination}
              sticky={sticky}
              disabled={disabled}
            />
          )}
        </>
      )}
    </div>
  );
};
