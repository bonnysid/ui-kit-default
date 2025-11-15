import {
  ChangeEvent,
  ComponentPropsWithRef,
  FC,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useMemo,
  useState,
} from 'react';
import { Caption, CaptionProps, Description, DescriptionProps, Loader } from '@/components';
import { useHidden } from '@/hooks';
import { bindStyles } from '@/utils';
import { HiddenControl, InputIcon, NumberControls } from './components';
import {
  FormatterOptions,
  UseValueFormatterProps,
  useCurrentType,
  useIncrement,
  useValueFormatter,
} from './hooks';
import styles from './Input.module.scss';
import { InputType } from './types';

type HTMLInputProps = ComponentPropsWithRef<'input'>;

export enum InputSizes {
  LARGE = 'large',
  MEDIUM = 'medium',
}

type OwnProps = UseValueFormatterProps &
  Partial<CaptionProps> &
  FormatterOptions &
  Partial<DescriptionProps> & {
    value?: string;
    onChangeValue: (value: string) => void;
    type?: InputType;
    size?: InputSizes;

    isWithNumberControls?: boolean;
    isCanBeHidden?: boolean;
    isClearable?: boolean;
    isTrimOnBlur?: boolean;
    isLoading?: boolean;
    isAllowSpaces?: boolean;

    prefix?: ReactNode;
    suffix?: ReactNode;
    controllerClassname?: string;
    max?: number;
    min?: number;
  };

export type InputProps = Omit<HTMLInputProps, keyof OwnProps> & OwnProps;

const cx = bindStyles(styles);

const ALLOWED_SPACES_BY_TYPE: Record<InputType, boolean> = {
  tel: false,
  number: false,
  search: true,
  email: false,
  password: false,
  text: true,
};

export const Input: FC<InputProps> = ({
  value,
  size = InputSizes.LARGE,
  type = 'text',
  caption,
  description,
  isError,
  errorText,
  disabled,
  isLoading,
  className,
  prefix,
  suffix,
  hint,
  children,
  mask,
  replacement,
  replacementPlaceholder,
  max,
  min,

  onKeyDown,
  onBlur,
  onFocus,
  onChangeValue,
  onChange,

  isWithNumberControls,
  isCanBeHidden,
  isClearable,
  isTrimOnBlur = true,
  isAllowNegative = false,
  isAllowSpaces,
  isWithThousandSeparator,

  decimals,
  maxLength,
  controllerClassname,
  decimalSeparator,
  ref,
  ...rest
}) => {
  const { isHidden, reveal, hide } = useHidden(type === 'password');
  const [isFocused, setIsFocused] = useState(false);

  const isAllowedSpace = isAllowSpaces ?? ALLOWED_SPACES_BY_TYPE[type];

  const hasDescription = useMemo(
    () => Boolean((errorText && isError) || description),
    [errorText, isError, description],
  );

  const hasRightContent = useMemo(() => {
    return Boolean(isLoading || isWithNumberControls || suffix || isCanBeHidden || isClearable);
  }, [isLoading, isWithNumberControls, suffix, isCanBeHidden, isClearable]);

  const currentType = useCurrentType({ type, isHidden });
  const { format, clean } = useValueFormatter({ type, mask, replacement, replacementPlaceholder });
  const { increment, decrement } = useIncrement({
    max,
    min,
    decimals,
    value,
    isAllowNegative,
    onChangeValue,
  });

  const formattedValue = useMemo(() => {
    if (value) {
      return format({
        value,
        isAllowNegative,
        decimals,
        decimalSeparator,
        maxLength,
        isWithThousandSeparator,
      });
    }

    return value;
  }, [
    format,
    value,
    isAllowNegative,
    decimals,
    decimalSeparator,
    maxLength,
    isWithThousandSeparator,
  ]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const isSpace = e.code === 'Space';

    if (isSpace && !isAllowedSpace) {
      e.preventDefault();
    }

    onKeyDown?.(e);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = clean(e.target.value);

    onChangeValue(newValue);

    onChange?.({
      ...e,
      target: { ...e.target, value: newValue },
      currentTarget: { ...e.currentTarget, value: newValue },
    });
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);

    if (isTrimOnBlur && value) {
      onChangeValue(value.trim());
    }

    onBlur?.(e);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleClear = (e: MouseEvent<SVGSVGElement>) => {
    onChangeValue('');
  };

  return (
    <label className={cx(className, 'input')}>
      {caption && <Caption caption={caption} hint={hint} />}
      <div
        className={cx(controllerClassname, 'controller', size, {
          isError,
          isFocused,
          disabled,
          isWithNumberControls,
        })}
      >
        {prefix && <div className={cx('prefix')}>{prefix}</div>}

        <input
          ref={ref}
          className={cx('field')}
          data-type={type}
          type={currentType}
          value={formattedValue}
          disabled={disabled ?? isLoading}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          {...rest}
        />

        {hasRightContent && (
          <div className={cx('right')}>
            {isLoading && <Loader className={cx('loader')} />}

            {isClearable && Boolean(value) && <InputIcon type="close" onClick={handleClear} />}

            {suffix && <div className={cx('suffix')}>{suffix}</div>}

            {isCanBeHidden && (
              <HiddenControl
                isHidden={isHidden}
                disabled={disabled}
                hide={hide}
                reveal={reveal}
                isPlaceholder={!value}
              />
            )}

            {isWithNumberControls && <NumberControls increment={increment} decrement={decrement} />}
          </div>
        )}
      </div>
      {hasDescription && (
        <Description
          isError={isError}
          errorText={errorText}
          description={description}
          disabled={disabled}
        />
      )}
    </label>
  );
};
