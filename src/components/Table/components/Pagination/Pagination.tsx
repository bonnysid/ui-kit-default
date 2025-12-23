import { FC, useMemo } from 'react';
import { useUIKitTranslation } from '@/hooks';
import { bindStyles, mapToOption } from '@/utils';
import { Button, ButtonSizes, ButtonVariants } from '../../../Button';
import { Select, SelectOption, SelectSizes } from '../../../Select';
import { UsePaginationReturn } from '../../hooks';
import styles from './Pagination.module.scss';

type PaginationProps = {
  pagination: UsePaginationReturn;
  sticky?: boolean;
  disabled?: boolean;
};

const cx = bindStyles(styles);

const PAGINATION_OPTIONS = [15, 25, 50].map((it) => mapToOption(it, it));

export const Pagination: FC<PaginationProps> = ({ pagination, sticky, disabled }) => {
  const { t } = useUIKitTranslation();

  const handleChangePageSize = (option?: SelectOption<number>) => {
    if (option) {
      pagination.onChangePageSize(option.value);
    }
  };

  const handleChangePage = (option?: SelectOption<number>) => {
    if (option) {
      pagination.onChangePage(option.value);
    }
  };

  const itemsInterval = useMemo(() => {
    const end = Math.min(pagination.page * pagination.pageSize, pagination.totalItems);

    return {
      start: pagination.page * pagination.pageSize - pagination.pageSize + 1,
      end,
    };
  }, [pagination.page, pagination.pageSize, pagination.totalItems]);

  const pageOptions = useMemo(() => {
    return Array(pagination.totalPages)
      .fill(1)
      .map((it, index) => {
        const value = index + it;
        return mapToOption(value, value);
      });
  }, [pagination.totalPages]);

  return (
    <div className={cx('table-pagination', { sticky })}>
      <div className={cx('select-block')}>
        <Select
          value={mapToOption(pagination.pageSize, pagination.pageSize)}
          options={PAGINATION_OPTIONS}
          onChange={handleChangePageSize}
          disabled={disabled}
          size={SelectSizes.MEDIUM}
        />
        <span className={cx('select-block-label')}>{t('pagination.itemsOnPage')}</span>
      </div>

      <span className={cx('items')}>
        {t('pagination.currentItems', {
          totalItems: pagination.totalItems,
          start: itemsInterval.start,
          end: itemsInterval.end,
        })}
      </span>

      <div className={cx('right')}>
        <div className={cx('select-block')}>
          <Select
            value={mapToOption(pagination.page, pagination.page)}
            options={pageOptions}
            onChange={handleChangePage}
            disabled={disabled}
            size={SelectSizes.MEDIUM}
          />
          <span className={cx('select-block-label')}>
            {t('pagination.ofPages', { totalPages: pagination.totalPages })}
          </span>
        </div>

        <div className={cx('buttons')}>
          <Button
            variant={ButtonVariants.SECONDARY}
            prefix="arrow-left"
            disabled={!pagination.hasPrevious || disabled}
            onClick={pagination.onPrevPage}
            size={ButtonSizes.MEDIUM}
          />
          <Button
            variant={ButtonVariants.SECONDARY}
            prefix="arrow-right"
            disabled={!pagination.hasNext || disabled}
            onClick={pagination.onNextPage}
            size={ButtonSizes.MEDIUM}
          />
        </div>
      </div>
    </div>
  );
};
