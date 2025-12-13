import { ComponentPropsWithRef, FC, MouseEvent, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSize, IconTypes, Loader } from '@/components';
import { bindStyles, checkIsExternalLink, isUndefinedOrNull } from '@/utils';
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

type OwnProps = {
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
  to?: string;
  href?: string;
  target?: string;
};

export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, keyof OwnProps> & OwnProps;

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
  to,
  href,
  target = '_blank',
  ...restProps
}) => {
  const navigate = useNavigate();
  const link = useMemo(() => to ?? href, [to, href]);

  const isExternal = useMemo(() => {
    return checkIsExternalLink(link || '');
  }, [link]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);

    if (link) {
      if (isExternal) {
        window.open(link, target);
      } else {
        navigate(link);
      }
    }
  };

  return (
    <button
      ref={ref}
      className={cx(className, 'button', variant, size, {
        active: isActive,
        fullWidth: isFullWidth,
        isLoading,
      })}
      disabled={isUndefinedOrNull(disabled) ? isLoading : disabled}
      onClick={handleClick}
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
