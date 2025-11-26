import { FC, MouseEvent, PropsWithChildren, useMemo } from 'react';
import { NavLink } from 'react-router-dom';

import { bindStyles, checkIsExternalLink, isUndefinedOrNull } from '@/utils';
import { Icon } from '../Icon';

import styles from './Link.module.scss';

export type LinkProps = PropsWithChildren<{
  className?: string;
  mailto?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  to?: string;
  href?: string;
  isExternalLink?: boolean;
  isExternalIcon?: boolean;
  isFullWidth?: boolean;
  isWithoutUnderline?: boolean;
}>;

enum ExternalLinkAttributes {
  target = '_blank',
  rel = 'noopener noreferrer',
}

const cx = bindStyles(styles);

export const Link: FC<LinkProps> = ({
  disabled,
  children,
  mailto,
  onClick,
  to,
  href,
  isExternalLink,
  isExternalIcon,
  className,
  isWithoutUnderline,
  isFullWidth,
  ...restProps
}) => {
  const link = useMemo(() => to ?? href, [to, href]);

  const isExternal = useMemo(() => {
    return isExternalLink || checkIsExternalLink(link || '');
  }, [isExternalLink, link]);

  const withExternalIcon = useMemo(() => {
    if (isExternal && isUndefinedOrNull(isExternalIcon)) {
      return true;
    }

    return isExternalIcon;
  }, [isExternal, isExternalIcon]);

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (mailto) {
      window.location.href = `mailto:${mailto}`;
      event.preventDefault();
    }
    onClick?.(event);
  };

  if (!isExternal) {
    return (
      <NavLink
        to={link || ''}
        className={cx('link', className, {
          disabled,
          withoutUnderline: isWithoutUnderline,
          fullWidth: isFullWidth,
        })}
        {...restProps}
        onClick={onLinkClick}
      >
        {children}
      </NavLink>
    );
  }

  return (
    <a
      target={isExternal ? ExternalLinkAttributes.target : '_self'}
      rel={isExternal ? ExternalLinkAttributes.rel : ''}
      href={link}
      className={cx('link', className, {
        disabled,
        withoutUnderline: isWithoutUnderline,
        fullWidth: isFullWidth,
      })}
      {...restProps}
      onClick={onLinkClick}
    >
      {children}
      {withExternalIcon && <Icon type="open-new-window" />}
    </a>
  );
};
