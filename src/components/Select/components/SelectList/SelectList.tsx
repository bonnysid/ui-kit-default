import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  CheckboxCaptionPosition,
  CheckboxVariants,
  Icon,
  Input,
  InputSizes,
  Popover,
  PopoverSharedProps,
} from '@/components';
import { SelectOption } from '@/components/Select/types';
import { useUIKitTranslation } from '@/hooks';
import { UI_KIT_NS } from '@/i18n';
import { bindStyles } from '@/utils';
import { SelectOptionItem, SelectOptionVariant } from '../SelectOptionItem';
import styles from './SelectList.module.scss';

export type SelectListSharedProps<T> = {
  searchPlaceholder?: string;

  isWithSelectAll?: boolean;
  isWithSearch?: boolean;
  options?: SelectOption<T>[];
};

export type SelectListProps<T> = SelectListSharedProps<T> &
  PopoverSharedProps & {
    onClickOption: (option: SelectOption<T>) => void;
    disabled?: boolean;
    onSelectAll?: (value?: SelectOption<T>[]) => void;
    isMulti?: boolean;
    value?: SelectOption<T> | SelectOption<T>[];
    onChange?: (value?: SelectOption<T> | SelectOption<T>[]) => void;
  };

const cx = bindStyles(styles);

export const SelectList = <T,>({
  value,
  options,
  disabled,
  searchPlaceholder,
  isMulti,
  onClickOption,
  isWithSelectAll,
  isWithSearch,
  onSelectAll,
  onClose,
  gap = 0,
  placementSide,
  placementAlignment,
  referenceRef,
}: SelectListProps<T>) => {
  const [search, setSearch] = useState('');
  const [hasScroll, setHasScroll] = useState(false);
  const hasOptions = Boolean(options?.length);
  const showHeader = isWithSearch && hasOptions;
  const showSubHeader = isWithSelectAll && isMulti && hasOptions;
  const listRef = useRef<HTMLDivElement | null>(null);
  const { t } = useUIKitTranslation();

  const filteredOptions = useMemo(() => {
    return (
      options?.filter((option) =>
        String(option.label).toLowerCase().includes(search.toLowerCase()),
      ) || []
    );
  }, [options, search]);

  const renderedOptions = useMemo(() => {
    if (!hasOptions || !filteredOptions.length) {
      return <div className={cx('select-list-empty')}>{t('noOptions')}</div>;
    }

    return filteredOptions.map((option) => {
      const arrayValue = Array.isArray(value) ? value : [value].filter(Boolean);
      const isSelected = arrayValue.map((it) => it?.value).includes(option.value);

      return (
        <SelectOptionItem
          key={String(option.value) + String(option.label)}
          disabled={disabled}
          option={option}
          variant={isMulti ? SelectOptionVariant.MULTI : SelectOptionVariant.SINGLE}
          isSelected={isSelected}
          onClick={() => onClickOption(option)}
        />
      );
    });
  }, [filteredOptions, onClickOption, value, disabled, isMulti, hasOptions]);

  const checkboxVariant = useMemo(() => {
    if (isMulti && Array.isArray(value)) {
      if (value) {
        if (value.length === options?.length) {
          return CheckboxVariants.MARKED;
        } else {
          return CheckboxVariants.MIXED;
        }
      }
    }
  }, [value, options, isMulti]);

  const checkboxValue = useMemo(() => {
    return isMulti && Array.isArray(value) && Boolean(value?.length);
  }, [value, isMulti]);

  const handleClickSelectAll = () => {
    if (onSelectAll) {
      if (checkboxValue) {
        onSelectAll(undefined);
      } else {
        onSelectAll(options);
      }
    }
  };

  const checkForScrollbar = () => {
    if (listRef?.current) {
      const hasVerticalScroll = listRef.current.scrollHeight > listRef.current.clientHeight;

      setHasScroll(hasVerticalScroll);
    }
  };

  const handleKeyDownInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    checkForScrollbar();
  }, [filteredOptions]);

  return (
    <Popover
      className={cx('select-list')}
      referenceRef={referenceRef}
      gap={gap}
      placementAlignment={placementAlignment}
      placementSide={placementSide}
      onClose={onClose}
    >
      {showHeader && (
        <div className={cx('select-list-header')}>
          {isWithSearch && (
            <Input
              value={search}
              onChangeValue={setSearch}
              prefix={<Icon type="search" />}
              placeholder={searchPlaceholder || t('search')}
              size={InputSizes.MEDIUM}
              onKeyDown={handleKeyDownInput}
            />
          )}
        </div>
      )}
      {showSubHeader && (
        <div className={cx('select-list-subheader')}>
          {isWithSelectAll && (
            <Checkbox
              value={checkboxValue}
              variant={checkboxVariant}
              caption={checkboxValue ? t('resetAll') : t('selectAll')}
              onChange={handleClickSelectAll}
              disabled={disabled}
              captionPosition={CheckboxCaptionPosition.LEFT}
            />
          )}
        </div>
      )}
      <div className={cx('select-list-items', { hasScroll })} ref={listRef}>
        {renderedOptions}
      </div>
    </Popover>
  );
};
