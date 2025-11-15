import { ComponentPropsWithRef, FC, ReactNode } from 'react';

import { IconSize, IconTypes, Loader } from '@/components';
import { bindStyles, isUndefinedOrNull } from '@/utils';

import styles from './Button.module.scss';
import { ButtonAddition } from './ButtonAddition';

const cx = bindStyles(styles);

export enum ButtonVariants {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  QUATERNARY = 'quaternary',
}

export enum ButtonSizes {
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small',
}

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  text?: ReactNode;
  hint?: string;
  count?: number;
  prefix?: IconTypes | ReactNode;
  suffix?: IconTypes | ReactNode;
  variant?: ButtonVariants;
  size?: ButtonSizes;
  isFullWidth?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
};

export const Button: FC<ButtonProps> = ({
  disabled,
  onClick,
  className,
  isFullWidth,
  type = 'button',
  text,
  variant = ButtonVariants.PRIMARY,
  prefix,
  suffix,
  size = ButtonSizes.LARGE,
  isLoading,
  children,
  count,
  isActive,
  hint,
  ref,
  ...restProps
}) => {
  return (
    <button
      ref={ref}
      className={cx(className, 'button', variant, size, {
        active: isActive,
        fullWidth: isFullWidth,
        isLoading,
      })}
      disabled={isUndefinedOrNull(disabled) ? isLoading : disabled}
      onClick={onClick}
      type={type}
      {...restProps}
    >
      {isLoading && <Loader size={IconSize.MEDIUM} className={cx('loader')} />}
      {prefix && <ButtonAddition icon={prefix} />}
      {(text || children) && <span className={cx('text')}>{text || children}</span>}
      {suffix && <ButtonAddition icon={suffix} />}
      {Boolean(count) && <span className={cx('count')}>{count}</span>}
    </button>
  );
};
