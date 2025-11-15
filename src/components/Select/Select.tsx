import { MouseEvent, useMemo, useRef } from 'react';
import {
  Button,
  ButtonSizes,
  ButtonVariants,
  Caption,
  CaptionProps,
  Description,
  DescriptionProps,
  Icon,
  IconTypes,
  Loader,
  TextShorter,
  Tooltip,
} from '@/components';
import { useOpenState } from '@/hooks';
import { bindStyles } from '@/utils';
import {
  SelectList,
  SelectListSharedProps,
  SelectOptionItem,
  SelectOptionVariant,
} from './components';
import styles from './Select.module.scss';
import { SelectOption } from './types';

export enum SelectSizes {
  LARGE = 'large',
  MEDIUM = 'medium',
}

export type SingleSelectProps<T> = {
  isMulti?: false;
  value?: SelectOption<T>;
  onChange?: (value?: SelectOption<T>) => void;
};

export type MultiSelectProps<T> = {
  isMulti: true;
  value?: SelectOption<T>[];
  onChange?: (value?: SelectOption<T>[]) => void;
};

export type SelectProps<T = string> = Partial<CaptionProps> &
  Partial<DescriptionProps> &
  SelectListSharedProps<T> &
  (SingleSelectProps<T> | MultiSelectProps<T>) & {
    size?: SelectSizes;
    options?: SelectOption<T>[];
    icon?: IconTypes;
    placeholder?: string;
    className?: string;

    disabled?: boolean;
    isLoading?: boolean;
    isCloseOnSelect?: boolean;
    isClearable?: boolean;
  };

const cx = bindStyles(styles);

export const Select = <T,>({
  size = SelectSizes.LARGE,
  caption,
  hint,
  icon,
  isError,
  errorText,
  value,
  description,
  className,
  placeholder,
  isLoading,
  onChange,
  searchPlaceholder,
  options,
  isWithSelectAll,
  isWithSearch,
  isCloseOnSelect = true,
  isClearable,
  isMulti,
  disabled,
}: SelectProps<T>) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const controls = useOpenState();

  const hasValue = useMemo(() => {
    return value && (isMulti ? Boolean(value.length) : Boolean(value));
  }, [value, isMulti]);

  const isDisabled = useMemo(() => {
    return disabled ?? isLoading;
  }, [isLoading, disabled]);

  const onClickOption = (option: SelectOption<T>) => {
    if (onChange) {
      if (isMulti) {
        const arrayValue = Array.isArray(value)
          ? value
          : ([value].filter(Boolean) as unknown as SelectOption<T>[]);
        onChange(
          arrayValue.map((it) => it?.value).includes(option.value)
            ? arrayValue.filter((it) => it?.value !== option.value)
            : [...arrayValue, option],
        );
      } else {
        onChange(option);
        if (isCloseOnSelect) {
          controls.close();
        }
      }
    }
  };

  const handleSelectAll = (options?: SelectOption<T>[]) => {
    if (isMulti) {
      onChange?.(options);
    }
  };

  const displayedValue = useMemo(() => {
    if (value) {
      if (isMulti) {
        if (value.length) {
          const [first, ...other] = value;

          return (
            <>
              <SelectOptionItem
                option={first}
                variant={SelectOptionVariant.VALUE}
                disabled={isDisabled}
              />
              {Boolean(other.length) && (
                <Tooltip
                  text={other.map((it) => (
                    <SelectOptionItem
                      key={String(it.value) + it.label}
                      labelClassName={cx('select-value-item')}
                      option={it}
                      variant={SelectOptionVariant.VALUE}
                    />
                  ))}
                  className={cx('select-value-counter')}
                >
                  <div className={cx('select-value-counter-text', { disabled: isDisabled })}>
                    +{other.length}
                  </div>
                </Tooltip>
              )}
            </>
          );
        }
      } else {
        return (
          <SelectOptionItem
            option={value}
            variant={SelectOptionVariant.VALUE}
            disabled={isDisabled}
          />
        );
      }
    }
  }, [value, isMulti, isDisabled]);

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    onChange?.(undefined);
  };

  return (
    <div className={cx(className, 'select', size)}>
      {caption && <Caption caption={caption} hint={hint} />}
      <div className={cx('select-control-wrapper')}>
        <button
          ref={triggerRef}
          type="button"
          className={cx('select-control', { isError })}
          disabled={isDisabled}
          onClick={controls.toggle}
        >
          <div className={cx('select-control-content')}>
            {icon && <Icon type={icon} className={cx('select-control-icon')} />}
            {placeholder && !hasValue && (
              <TextShorter className={cx('select-placeholder')}>{placeholder}</TextShorter>
            )}
            {hasValue && <div className={cx('select-value')}>{displayedValue}</div>}
          </div>

          <div className={cx('controls')}>
            {isClearable && hasValue && (
              <Button
                prefix="close"
                onClick={handleClear}
                size={ButtonSizes.SMALL}
                variant={ButtonVariants.TERTIARY}
              />
            )}
            {!isLoading && (
              <Icon
                type="chevron"
                className={cx('select-control-icon', { isOpened: controls.isOpen })}
              />
            )}
            {isLoading && <Loader className={cx('select-control-loader')} />}
          </div>
        </button>

        {controls.isOpen && (
          <SelectList<T>
            referenceRef={triggerRef}
            onClose={controls.close}
            options={options}
            disabled={isDisabled}
            onClickOption={onClickOption}
            value={value}
            isWithSelectAll={isWithSelectAll}
            isWithSearch={isWithSearch}
            isMulti={isMulti}
            searchPlaceholder={searchPlaceholder}
            onSelectAll={handleSelectAll}
          />
        )}
      </div>

      <Description
        description={description}
        isError={isError}
        disabled={disabled}
        errorText={errorText}
      />
    </div>
  );
};
