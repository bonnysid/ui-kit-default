import {
  ChangeEvent,
  FC,
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  SyntheticEvent,
  useMemo,
  useState,
} from 'react';

import { bindStyles } from '@/utils';
import { Icon, IconTypes } from '../Icon';
import styles from './Checkbox.module.scss';

export enum CheckboxSizes {
  LARGE = 'LARGE',
  MEDIUM = 'MEDIUM',
}

export enum CheckboxVariants {
  MARKED = 'MARKED',
  MIXED = 'MIXED',
}

export enum CheckboxCaptionPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

type OwnProps = {
  errorText?: string;
  isError?: boolean;
  caption?: string;
  disabled?: boolean;
  size?: CheckboxSizes;
  variant?: CheckboxVariants;
  captionPosition?: CheckboxCaptionPosition;
  value?: boolean;
  onChangeValue?: (value: boolean) => void;
};

type NativeInputProps = InputHTMLAttributes<HTMLInputElement>;

export type CheckboxProps = Omit<NativeInputProps, keyof OwnProps> & OwnProps;

const cx = bindStyles(styles);

const ICON_MAP: Record<CheckboxVariants, IconTypes> = {
  [CheckboxVariants.MARKED]: 'check',
  [CheckboxVariants.MIXED]: 'minus',
};

export const Checkbox: FC<CheckboxProps> = ({
  isError,
  errorText,
  variant = CheckboxVariants.MARKED,
  disabled,
  children,
  value = false,
  onChange,
  onChangeValue,
  caption,
  captionPosition = CheckboxCaptionPosition.RIGHT,
  size = CheckboxSizes.LARGE,
  onFocus,
  onBlur,
  onKeyDown,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);

    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);

    onBlur?.(e);
  };
  const onInputClick = (e: SyntheticEvent) => e.stopPropagation();

  const toggle = () => {
    if (!disabled) {
      onChangeValue?.(!value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      toggle();
    }

    onKeyDown?.(e);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeValue?.(e.target.checked);

    onChange?.(e);
  };

  const renderedIcon = useMemo(() => {
    return <Icon type={ICON_MAP[variant]} className={cx('icon', { hasValue: Boolean(value) })} />;
  }, [variant, value]);

  const renderedCaption = useMemo(() => {
    if (caption || errorText) {
      return (
        <div className={cx('textContainer', size)}>
          {caption && <div className={cx('caption')}>{caption || children}</div>}
          {isError && errorText && <div className={cx('error')}>{errorText}</div>}
        </div>
      );
    }
  }, [caption, errorText, isError, children, size]);

  return (
    <label className={cx('wrapper', size, { disabled, isError, isActive: value })} onClick={toggle}>
      {captionPosition === CheckboxCaptionPosition.LEFT && renderedCaption}

      <div className={cx('checkboxWrapper')}>
        <div className={cx('checkbox', { isFocused })}>
          {renderedIcon}

          <input
            type="checkbox"
            disabled={disabled}
            checked={value}
            onChange={handleChange}
            onClick={onInputClick}
            className={cx('input')}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            {...rest}
          />
        </div>
      </div>

      {captionPosition === CheckboxCaptionPosition.RIGHT && renderedCaption}
    </label>
  );
};
