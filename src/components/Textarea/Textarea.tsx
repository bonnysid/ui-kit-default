import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  FC,
  FocusEvent,
  forwardRef,
  KeyboardEvent,
  useMemo,
  useState,
} from 'react';

import { Caption, CaptionProps, Description, DescriptionProps } from '@/components';
import { UseMaskOptions, useMask } from '@/hooks';
import { bindStyles } from '@/utils';
import styles from './Textarea.module.scss';

type TextareaAdditionalProps = Partial<CaptionProps> &
  UseMaskOptions &
  Partial<DescriptionProps> & {
    value?: string;
    isAllowSpaces?: boolean;
    isTrimOnBlur?: boolean;
    isResizeableVertical?: boolean;
    isResizeableHorizontal?: boolean;
    onChangeValue?: (value: string) => void;
  };

export type TextareaProps = Omit<
  ComponentPropsWithoutRef<'textarea'>,
  keyof TextareaAdditionalProps
> &
  TextareaAdditionalProps;

const cx = bindStyles(styles);

export const Textarea: FC<TextareaProps> = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      value,
      onFocus,
      onBlur,
      onChange,
      caption,
      description,
      hint,
      isError,
      errorText,
      disabled,
      onChangeValue,
      className,
      mask,
      replacementPlaceholder,
      replacement,
      onKeyDown,
      isAllowSpaces,
      isResizeableVertical,
      isResizeableHorizontal,
      isTrimOnBlur,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const { apply, clean } = useMask({ mask, replacement, replacementPlaceholder });

    const formattedValue = useMemo(() => {
      if (value) {
        return apply(value);
      }
    }, [value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      const isSpace = e.code === 'Space';

      if (isSpace && !isAllowSpaces) {
        e.preventDefault();
      }

      onKeyDown?.(e);
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = clean(e.target.value);

      onChangeValue?.(newValue);

      onChange?.({
        ...e,
        target: { ...e.target, value: newValue },
        currentTarget: { ...e.currentTarget, value: newValue },
      });
    };

    const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);

      if (isTrimOnBlur && value) {
        onChangeValue?.(value.trim());
      }

      onBlur?.(e);
    };

    const handleFocus = (e: FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    return (
      <label className={cx(className, 'textarea')}>
        {caption && <Caption caption={caption} hint={hint} />}

        <textarea
          ref={ref}
          className={cx('controller', {
            isError,
            isFocused,
            isResizeableVertical,
            isResizeableHorizontal,
            isResizeableBoth: isResizeableVertical && isResizeableHorizontal,
          })}
          disabled={disabled}
          value={formattedValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          {...rest}
        />

        <Description
          description={description}
          isError={isError}
          errorText={errorText}
          disabled={disabled}
        />
      </label>
    );
  },
);

Textarea.displayName = 'Textarea';
