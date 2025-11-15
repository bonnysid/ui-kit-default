import { memo, useMemo } from 'react';
import { Checkbox, Icon, TextShorter } from '@/components';
import { SelectOption } from '@/components/Select/types';
import { bindStyles } from '@/utils';
import styles from './SelectOptionItem.module.scss';

export enum SelectOptionVariant {
  VALUE = 'value',
  MULTI = 'multi',
  SINGLE = 'single',
}

export type SelectOptionItemProps<T> = {
  className?: string;
  labelClassName?: string;
  option: SelectOption<T>;
  variant?: SelectOptionVariant;
  isSelected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const cx = bindStyles(styles);

export const SelectOptionItem = memo(
  <T,>({
    className,
    labelClassName,
    option,
    variant = SelectOptionVariant.SINGLE,
    disabled,
    isSelected,
    onClick,
  }: SelectOptionItemProps<T>) => {
    const isDisabled = useMemo(() => {
      return disabled ?? option.disabled;
    }, [disabled, option.disabled]);

    const renderedCheckmark = useMemo(() => {
      if (variant === SelectOptionVariant.VALUE) {
        return null;
      }

      if (variant === SelectOptionVariant.SINGLE && isSelected) {
        return <Icon type="check" className={cx('select-option-check-icon')} />;
      }

      if (variant === SelectOptionVariant.MULTI) {
        return <Checkbox value={isSelected} disabled={isDisabled} />;
      }
    }, [isSelected, variant, isDisabled]);

    return (
      <button
        tabIndex={variant === SelectOptionVariant.VALUE ? -1 : undefined}
        type="button"
        className={cx(className, 'select-option', variant, { isSelected })}
        onClick={onClick}
        disabled={isDisabled}
      >
        <div className={cx('select-option-content')}>
          {option.suffix && <div className={cx('suffix')}>{option.suffix}</div>}
          <TextShorter className={cx(labelClassName, 'select-option-label')}>
            {option.label}
          </TextShorter>
          {option.prefix && <div className={cx('prefix')}>{option.prefix}</div>}
          {renderedCheckmark}
        </div>
        {option.description && variant !== SelectOptionVariant.VALUE && (
          <div className={cx('select-option-description')}>{option.description}</div>
        )}
      </button>
    );
  },
);

SelectOptionItem.displayName = 'SelectOptionItem';
