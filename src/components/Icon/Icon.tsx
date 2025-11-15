import { CSSProperties, DetailedHTMLProps, FC, HTMLAttributes, useMemo } from 'react';

import { bindStyles } from '@/utils';
import styles from './Icon.module.scss';
import { ICONS, IconTypes } from './types';

export enum IconSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export type IconProps = DetailedHTMLProps<HTMLAttributes<SVGSVGElement>, SVGSVGElement> & {
  type: IconTypes;
  size?: IconSize | number;
};

type CSSVariables = {
  '--icon-size'?: string;
};

type CustomStyle = CSSProperties & CSSVariables;

const cn = bindStyles(styles);

export const Icon: FC<IconProps> = ({
  type,
  size = IconSize.MEDIUM,
  style,
  className,
  ...props
}) => {
  const customStyles = useMemo(() => {
    let sizeStyles: undefined | CustomStyle;

    if (Number.isFinite(size)) {
      sizeStyles = { '--icon-size': `${size}px` };
    }

    return sizeStyles ? { ...style, ...sizeStyles } : style;
  }, [style, size]);

  const IconSVG = useMemo(() => ICONS[type], [type]);

  const formattedSize = useMemo(() => {
    if (typeof size === 'string') {
      return size;
    }

    return undefined;
  }, [size]);

  if (!IconSVG) {
    return null;
  }

  return (
    <IconSVG className={cn(className, 'icon', formattedSize)} style={customStyles} {...props} />
  );
};
